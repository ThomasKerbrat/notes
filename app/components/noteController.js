(function() {
	"use strict";

	angular
		.module('noteapp')
		.controller('NoteController', NoteController);

	NoteController.$inject = ['$scope', '$log', 'localStorageProvider'];
	function NoteController ($scope, $log, localStorageProvider) {

		// ----------------------------------------
		// - Initialization.
		// ----------------------------------------
		var vm = this;
		vm.addNote = addNote;
		vm.copyNote = copyNote;
		vm.deleteNote = deleteNote;
		vm.notes = [];
		vm.selectedNote = {};
		vm.selectedNoteIndex = -1;
		vm.selectNote = selectNote;

		(function init() {
			// Try to retrieve the notes from local storage.
			var ls_notes = getNotes();
			if (typeof ls_notes === 'object') {
				vm.notes = ls_notes;
			}

			// Try to retrieve the last selected note index from local storage.
			var ls_selectedNoteIndex = getSelectedNoteIndex();
			if (typeof ls_selectedNoteIndex === 'number') {
				vm.selectedNoteIndex = ls_selectedNoteIndex;
			}

			// Set watches on notes and selectedNoteIndex properties of the scope. 
			$scope.$watch('vm.notes', updateNoteHandler, true);
			$scope.$watch('vm.selectedNoteIndex', updateSelectedNoteIndexHandler, true);
		})();



		// ----------------------------------------
		// - Functions declarations.
		// ----------------------------------------

		// Add an empty note
		function addNote () {
			vm.notes[vm.notes.length] = {
				'name': '',
				'content': ''
			};

			vm.selectNote(vm.notes.length - 1);
		}

		// Copy the note in notes array at index selectedNoteIndex.
		function copyNote () {
			if (vm.selectedNoteIndex <= -1 || vm.selectedNoteIndex >= vm.notes.length) return;

			var nextIndex = vm.notes.length;
			vm.notes[nextIndex] = {
				'name': vm.notes[vm.selectedNoteIndex].name,
				'content': vm.notes[vm.selectedNoteIndex].content
			};

			vm.selectNote(nextIndex);
		}

		// Remove the note in notes array at index selectedNoteIndex.
		function deleteNote (index) {
			if (vm.selectedNoteIndex == -1) return;

			vm.notes.splice(vm.selectedNoteIndex, 1);
			vm.selectedNote = {};
			vm.selectedNoteIndex = -1;
		}

		// Change the selectedNote and selectedNoteIndex variable.
		function selectNote (index) {
			vm.selectedNote = vm.notes[index];
			vm.selectedNoteIndex = index;
		}



		// ----------------------------------------
		// - Privates/internals function declarations.
		// ----------------------------------------

		// Get selected note index from the local storage.
		function getSelectedNoteIndex(){
			return localStorageProvider.get('selected-note-index');
		}

		// Set selected note index from the local storage.
		function setSelectedNoteIndex() {
			localStorageProvider.set('selected-note-index', angular.toJson(vm.selectedNoteIndex));
		}

		// Get notes to the local storage.
		function getNotes() {
			return localStorageProvider.get('notes');
		}

		// Set notes to the local storage.
		function setNotes() {
			localStorageProvider.set('notes', angular.toJson(vm.notes));
		}

		// Handle function when a note is updated.
		function updateNoteHandler(newValue, oldValue) {
			// Handler called by initialization.
			if (newValue === oldValue) {
				return;
			}

			setNotes();
		}

		// Handle function when a note is updated.
		function updateSelectedNoteIndexHandler(newValue, oldValue) {
			// Handler called by initialization.
			if (newValue === oldValue) {
				return;
			}

			setSelectedNoteIndex();
		}
	}
})();
