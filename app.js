/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers
 */

console.log('---- start register service worker!')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sso/sw.js', { scope: '/sso/' }).then(function(reg) {
    // registration worked
    console.log('-- Registration succeeded. Scope is ' + reg.scope)

    if (reg.installing) {
      console.log('-- Service worker installing')
    } else if (reg.waiting) {
      console.log('-- Service worker installed')
    } else if (reg.active) {
      console.log('-- Service worker active')
    }

  }).catch(function(error) {
    // registration failed
    console.log('-- Registration failed with:')
    console.error(error)
  })
}

window.onload = function() {
  function goPage(redirect, usermap) {
    if (usermap) {
      const code = encodeURIComponent(usermap)
  
      let url = `${redirect}?usermap=${code}`
      if (redirect.includes('?')) {
        url = `${redirect}&usermap=${code}`
      }
    
      window.location.replace(url)
    } else {
      window.location.replace(redirect)
    }
  }

  // https://joehecn.github.io/sso/#method=getusermap&redirect=https%3A%2F%2Fwww.baidu.com%2F
  // https://joehecn.github.io/sso/#method=setusermap&username=joe&uuid=xxxx&redirect=https%3A%2F%2Fwww.baidu.com%2F
  function getQueryMap() {
    try {
      const map = {}

      if (window.location.hash) {
        const hash = window.location.hash
        const params = hash.substr(1).split('&')

        for (let i = 0, len = params.length; i < len; i++) {
          const param = params[i]
          const [uuid, value] = param.split('=')
          map[uuid] = decodeURIComponent(value)
        }
      }

      return map
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  function getUserMap(redirect) {
    if (redirect) {
      const usermap = localStorage.getItem('usermap') || '{}'
      goPage(redirect, usermap)
    }
  }

  function setUserMap(username, uuid, redirect) {
    if (username && uuid && redirect) {
      const usermap = localStorage.getItem('usermap') || '{}'
      const obj = JSON.parse(usermap)
      obj[username] = uuid

      localStorage.setItem('usermap', JSON.stringify(obj))

      goPage(redirect)
    }
  }

  function main() {
    const queryMap = getQueryMap()

    if (queryMap.method === 'getusermap') {
      getUserMap(queryMap.redirect)
    } else if (queryMap['method'] === 'setusermap') {
      const { username, uuid, redirect } = queryMap
      setUserMap(username, uuid, redirect)
    }
  }

  main()
}