const { program } = require('commander');
const fs = require('fs');

/* Helper Functions */
// Read Database
const DB_URL = './db.json';

const readDB = () => {
  const dbString =
    fs.readFileSync(DB_URL, {
      encoding: 'utf-8',
    }) || '[]';
  const DB = JSON.parse(dbString);
  return DB;
};

// Write in the  Database
const writeDB = (notes) => {
  const notesJson = JSON.stringify(notes);
  fs.writeFileSync(DB_URL, notesJson, 'utf-8');
};
/* Helper Functions */

/* Start the Program */
// Descripe the Application
program
  .name('Note App')
  .description('CRUD Note App using CLI')
  .version('0.0.1');

// Add Command
program
  .command('add')
  .description('Add a note to the notes')
  .argument('<string>', 'Note Title')
  .option('-t', 'To set the note title')
  .action((str, options) => {
    // Read DB
    const notes = readDB();
    // Create the new note
    const newNote = {
      title: str,
      status: 'to-do',
      date: Date.now(),
      id: notes.length > 0 ? notes[notes.length - 1]['id'] + 1 : 1,
    };
    // push it to the array of notes
    notes.push(newNote);
    // Write in the DB
    writeDB(notes);
    console.log(notes);
  });

// List Command
program
  .command('list')
  .description('List all notes in the Database')
  .argument('[string]', 'Note Status')
  .option('-s', 'To select the notes with the status specified only')
  .action((str, options) => {
    // Read DB
    const notes = readDB();
    let selectedNotes = notes;
    // Filter the Notes
    if (options['s'] && str) {
      const status = str.toLowerCase();
      if (status === 'to-do' || status === 'in progress' || status === 'done') {
        selectedNotes = selectedNotes.filter(
          (note) => note['status'] === status
        );
      }
    }
    console.log(selectedNotes);
  });

// Edit Command
program
  .command('edit')
  .description('Edit note with specific id')
  .option('-s, --status [status]', 'To edit the note status')
  .option('-t, --title [title]', 'To set the note title')
  .option('--id <id>', 'Note id')
  .action((options) => {
    console.log(options);
    const noteID = Number(options['id']);
    // Read DB
    let notes = readDB();
    // Find the note and edit it
    if (options['status'] || options['title']) {
      // Edit title
      if (options['title']) {
        notes = notes.map((note) => {
          if (note['id'] === noteID) {
            note['title'] = options['title'];
          }
          return note;
        });
      }
      // Edit Status
      if (options['status']) {
        const status = options['status'].toLowerCase();
        if (
          status === 'to-do' ||
          status === 'in progress' ||
          status === 'done'
        ) {
          notes = notes.map((note) => {
            if (note['id'] === noteID) {
              note['status'] = status;
            }
            return note;
          });
        }
      }
    } else {
      console.log('Error: Please enter Title or Status to edit');
      process.exit();
    }
    // Write in the DB
    writeDB(notes);
    console.log(notes);
  });

// Delete Command
program
  .command('delete')
  .description('Delete a note from the notes')
  .argument('<number>', 'Note ID')
  .option('--id', 'To delete the specific note')
  .action((str, options) => {
    const id = Number(str);
    // Read DB
    const notes = readDB();
    // Filter the Notes
    let selectedNotes = notes;
    let deletedNote = notes.filter((note) => note['id'] === id);
    if (options['id'] && id) {
      selectedNotes = selectedNotes.filter((note) => note['id'] !== id);
    }
    // Write in the DB
    writeDB(selectedNotes);
    console.log(deletedNote);
  });
program.parse();
/* Start the Program */
