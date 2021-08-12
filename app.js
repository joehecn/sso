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

  console.log({ location })
}