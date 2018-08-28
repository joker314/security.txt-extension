/**
 * Scan a website for a security.txt file
 *
 * @return {Promise} A promise which resolves to an object {data, redirect}
 */
function findSecurityTxt() {
  return new Promise((res, rej) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      if(!tab.length) {
        rej()
      } else {
        const url = new URL(tab[0].url)
        fetch(url.origin + '/.well-known/security.txt').then(function(response) {
          if(response.ok) {
            const newUrl = new URL(response.url)
            response.text().then(body => res({data: body, redirect: url.origin !== newUrl.origin && newUrl.origin}))
          } else {
            fetch(url.origin + '/security.txt').then(function(response) {
              if(response.ok) {
                const newUrl = new URL(response.url)
                response.text().then(body => res({data: body, redirect: url.origin !== newUrl.origin && newUrl.origin}))
              } else {
                rej()
              }
            })
          }
        }).catch(rej)
      }
    })
  })
}