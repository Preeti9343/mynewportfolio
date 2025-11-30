// Notes App State
let notes = [];
let currentNote = null;
let currentCategory = 'all';

// DOM Elements
const newNoteBtn = document.getElementById('new-note-btn');
const searchInput = document.getElementById('search-input');
const notesList = document.getElementById('notes-list');
const noteEditor = document.getElementById('note-editor');
const emptyState = document.getElementById('empty-state');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveNoteBtn = document.getElementById('save-note');
const deleteNoteBtn = document.getElementById('delete-note');
const pinNoteBtn = document.getElementById('pin-note');
const categoryBtns = document.querySelectorAll('.category-btn');
const noteCategory = document.getElementById('note-category');
const wordCount = document.getElementById('word-count');
const lastSaved = document.getElementById('last-saved');
const toolBtns = document.querySelectorAll('.tool-btn');

// Initialize the app
function init() {
    // Load notes from localStorage
    loadNotes();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show empty state initially
    showEmptyState();
}

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotesList();
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Set up event listeners
function setupEventListeners() {
    // New note button
    newNoteBtn.addEventListener('click', createNewNote);
    
    // Search input
    searchInput.addEventListener('input', handleSearch);
    
    // Save note button
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    
    // Delete note button
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);
    
    // Pin note button
    pinNoteBtn.addEventListener('click', togglePinNote);
    
    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            updateCategoryButtons();
            renderNotesList();
        });
    });
    
    // Note category change
    noteCategory.addEventListener('change', updateNoteCategory);
    
    // Word count update
    noteContent.addEventListener('input', updateWordCount);
    
    // Toolbar buttons
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.dataset.command;
            document.execCommand(command, false, null);
        });
    });
    
    // Auto-save
    let autoSaveTimeout;
    noteContent.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(saveCurrentNote, 1000);
    });
}

// Create a new note
function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: 'Untitled Note',
        content: '',
        category: 'work',
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    notes.unshift(newNote);
    saveNotes();
    renderNotesList();
    openNote(newNote);
}

// Open a note
function openNote(note) {
    currentNote = note;
    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteCategory.value = note.category;
    updateWordCount();
    updateLastSaved(note.updatedAt);
    
    noteEditor.style.display = 'block';
    emptyState.style.display = 'none';
}

// Save current note
function saveCurrentNote() {
    if (!currentNote) return;
    
    currentNote.title = noteTitle.value;
    currentNote.content = noteContent.innerHTML;
    currentNote.category = noteCategory.value;
    currentNote.updatedAt = new Date();
    
    saveNotes();
    renderNotesList();
    updateLastSaved(currentNote.updatedAt);
}

// Delete current note
function deleteCurrentNote() {
    if (!currentNote) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== currentNote.id);
        saveNotes();
        renderNotesList();
        showEmptyState();
    }
}

// Toggle pin status of current note
function togglePinNote() {
    if (!currentNote) return;
    
    currentNote.pinned = !currentNote.pinned;
    saveNotes();
    renderNotesList();
    updatePinButton();
}

// Update note category
function updateNoteCategory() {
    if (!currentNote) return;
    
    currentNote.category = noteCategory.value;
    saveNotes();
    renderNotesList();
}

// Update word count
function updateWordCount() {
    const text = noteContent.innerText;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `${words.length} words`;
}

// Update last saved time
function updateLastSaved(date) {
    const formattedDate = new Date(date).toLocaleString();
    lastSaved.textContent = `Last saved: ${formattedDate}`;
}

// Update pin button state
function updatePinButton() {
    if (!currentNote) return;
    
    pinNoteBtn.classList.toggle('active', currentNote.pinned);
}

// Update category buttons
function updateCategoryButtons() {
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });
}

// Handle search
function handleSearch() {
    renderNotesList();
}

// Show empty state
function showEmptyState() {
    noteEditor.style.display = 'none';
    emptyState.style.display = 'block';
    currentNote = null;
}

// Render notes list
function renderNotesList() {
    notesList.innerHTML = '';
    
    // Filter notes based on category and search
    let filteredNotes = notes;
    
    if (currentCategory !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.category === currentCategory);
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort notes (pinned first, then by date)
    filteredNotes.sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned - a.pinned;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    // Create note items
    filteredNotes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        if (note.pinned) noteItem.classList.add('pinned');
        
        const preview = note.content.replace(/<[^>]*>/g, '').substring(0, 100);
        const date = new Date(note.updatedAt).toLocaleDateString();
        
        noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p>${preview}${note.content.length > 100 ? '...' : ''}</p>
            <div class="note-meta">
                <span>${date}</span>
                <span>${note.category}</span>
            </div>
        `;
        
        noteItem.addEventListener('click', () => openNote(note));
        notesList.appendChild(noteItem);
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 