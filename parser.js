/**
 * Parses a security.txt file into
 * an object.
 *
 * @param {string} file - The content of the security.txt file
 */
function parse(file) {
  const lines = getLinesFromFile(file)
  
  let comments = []
  
  const result = {"_errors!": []}
  
  lines.forEach(line => {
    if(line.isInvalid) {
      result["_errors!"].push(line.toString())
      return
    }
    
    if(line.isComment) {
      comments.push(line.commentText)
    }
    
    if(line.isDirective) {
      // If this directive hasn't been used before, initialise it
      if(!result[line.key]) result[line.key] = []
      
      // If there are comments, add them to output and purge
      if(comments.length) {
        result[line.key].push({
          type: "comment",
          value: comments.join("\n")
        })
        
        comments = []
      }
      
      // Then, output the directive
      result[line.key].push({
        type: "directive",
        value: line.value
      })
    }
  })
  
  return result
}

class Line extends String {
  constructor(string) {
    super(string)
  }
  
  get isInvalid() {
    return !(this.startsWith("#") || this.split(":").length > 1)
  }
  
  get isComment() {
    return this.startsWith("#")
  }
  
  get isDirective() {
    return (!this.isComment) && this.split(":")
  }
  
  get key() {
    return this.split(":")[0].toLowerCase().trim()
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