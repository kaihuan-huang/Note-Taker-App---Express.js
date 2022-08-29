const util = require('util');
const fs = require('fs');
//“通用唯一标识符”，或UUID, 旨在为我们用于数据的任何唯一 ID 提供一致的格式。UUID 解决了生成唯一 ID 的问题 - 随机或使用某些数据作为种子。
const uuid = require('uuid').v1;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileAsync('db/db.json', 'utf-8')
    }
    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note))
    }

    addNote(note) {
        const {title, text } = note

        if (!title || !text) {
            throw new Error("Title or Text cannot be blank")
        }

        const newNote = { title, text, id:uuid() }

        return this.getNotes()
            .then(notes => [...notes, newNote])
            .then(updateNotes => this.write(updateNotes))
            .then(() => this.newNote)
    }

    getNotes() {
        return this.read()
            .then(notes => {
                return JSON.parse(notes) || [];
            })
    }

    removeNote(id) {
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== id))
            .then(keptNotes => this.write(keptNotes))
    }
    
}

module.exports = new Store();