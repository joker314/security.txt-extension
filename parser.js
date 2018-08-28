/**
 * Parses a security.txt file into
 * an object.
 *
 * @param {string} file - The content of the security.txt file
 */
function parse(file) {
  const lines = getLinesFromFile(file)
  
  let comments = []
  
  const result = {errors: [], directives: {}}
  
  lines.forEach(line => {
    if(line.isInvalid) {
      result.errors.push(line.toString())
      return
    }
    
    if(line.isComment) {
      comments.push(line.commentText)
    }
    
    if(line.isDirective) {
      // If this directive hasn't been used before, initialise it
      if(!result.directives[line.key]) {
        result.directives[line.key] = []
      }
      
      // If there are comments, add them to output and purge
      if(comments.length) {
        result.directives[line.key].push({
          type: "comment",
          value: comments.join("\n")
        })
        
        comments = []
      }
      
      // Then, output the directive
      result.directives[line.key].push({
        type: "directive",
        value: line.value
      })
    }
  })
  
  // If there were comments at the end of the file, they
  // haven't been associated with a directive. Add them
  // to the object.
  result.hangingComments = comments
  
  result.original = file
  return result
}

class Line extends String {
  constructor(string) {
    super(string)
  }
  
  get isInvalid() {
    if(this.isComment) {
      return false
    }

    if(this.isDirective) {
      return !ALLOWED_FIELDS.includes(this.key)
    }
    
    return true
  }
  
  get isComment() {
    return this.startsWith("#")
  }
  
  get isDirective() {
    return (!this.isComment) && (this.split(":").length > 1)
  }
  
  get key() {
    return this.split(":")[0].toLowerCase().replace(/^acknowledgments$/i, "acknowledgements").trim()
  }
  
  get value() {
    return this.split(":").slice(1).join(":").trim()
  }
  
  get commentText() {
    return this.substr(1).trim()
  }
}

/** 
 * Splits a string into an array of lines,
 * with whitespaced lines removed, and each
 * line trimmed. The lines are of type Line.
 *
 * @param {string} file - The string of newline-seperated lines
 * @return {!Line[]} Array of trimmed, filtered, lines.
 */
function getLinesFromFile(file) {
  return file.split("\n")
  .map(line => line.trim())
  .filter(line => /\S/.test(line))
  .map(line => new Line(line))
}