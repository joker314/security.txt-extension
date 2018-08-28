document.documentElement.style.minWidth = '500px'

function render (parsed) {
  const output = document.querySelector('#content')
  
  const isInvalid = parsed.errors.length ||!parsed.directives.contact
  
  if (!isInvalid) {
    // Iterate over all other directives
    const sortedFields = Object.keys(parsed.directives).sort((a, b) => sortFromList(a.key, b.key, ALLOWED_FIELDS))
    
    sortedFields.forEach(key => {
      const directiveEl = directive(capitalize(key), parsed.directives[key])
      output.appendChild(directiveEl)
      
      if(key === 'contact') {
        directiveEl.setAttribute('open', true)
      }
    })
    
    // Comments at the end of the file aren't attached to a directive
    if(parsed.hangingComments.length) {
      const hangingComment = document.createElement('DIV')
      hangingComment.textContent = parsed.hangingComments.join('\n')
      
      hangingComment.classList.add('info')
      
      output.appendChild(hangingComment)
    }

    // Show a warning if Permission: is set
    if (parsed.directives.permission) {
      document.querySelector('#permission').classList.remove('invisible')
    }
  } else {
    // Show a warning to explain that the file is malformed
    document.querySelector('#unrendered').classList.remove('invisible')
    
    const pre = document.createElement('PRE')
    pre.textContent = parsed.original

    output.appendChild(pre)
  }
}

/**
 * In the sort order of the list provided, but
 * with ommitted elements ommitted.
 *
 * @param {*} a - The firt argument provided by the Array.prototype.sort callback
 * @param {*} b - The second argument provided by the Array.prototype.sort callback
 * @param {Array} list - The array from which to determine the sort order
 * @return {Number} The return value for Array.prototype.sort (i.e., negative, positive, or zero)
 */
function sortFromList(a, b, list) {
  return list.indexOf(b) - list.indexOf(a)
}

function directive(summary, details) {
  const detailsEl = document.createElement("DETAILS")
  const summaryEl = document.createElement("SUMMARY")

  detailsEl.appendChild(summaryEl)
  summaryEl.textContent = summary

  details.forEach(detail => {
    if(detail.type === 'comment') {
      const comment = document.createElement('DIV')
      comment.textContent = detail.value
      comment.classList.add('info')
      detailsEl.appendChild(comment)
    } else {
      // @todo fix security issue with window.opener
      // @todo turn scheme into img

      const anchor = document.createElement('A')
      detailsEl.appendChild(anchor)

      anchor.setAttribute('href', detail.value)
      anchor.textContent = detail.value
    }
  })
  
  return detailsEl
}

/**
 * Converts a string such that its first
 * character is uppercase; and all subsequent
 * characters are lowercase.
 *
 * @param {string} string - The string to capitalise
 * @param {string} A capitalised string
 */
function capitalize(string) {
  return string[0].toUpperCase() + string.substr(1).toLowerCase()
}


// Actually crawl, parse, and render the security.txt file
findSecurityTxt().then(function(response) {
  if(response.redirect !== false) {
    document.querySelector('#redirect').classList.remove('invisible')
    document.querySelector('#redirectOrigin').textContent = response.redirect
  }
  render(parse(response.body))
}).catch(function() {
  document.querySelector('#content').innerText = 'No security.txt file detected.'
})