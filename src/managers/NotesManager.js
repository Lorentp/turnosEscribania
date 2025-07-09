const Notes = require("../models/Notes")

class NotesManager {
    async createNote(note){
        const newNote = new Notes({note})

        return await newNote.save()
    }

    async getNotes(){
        const notes = await Notes.find().lean();

        return notes
    }

    async deleteNote(id) {
        await Notes.findByIdAndDelete(id)
    }
}


module.exports = new NotesManager()