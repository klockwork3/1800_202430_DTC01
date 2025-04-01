
function isOnMainPage() {
      return window.location.pathname === '/' ||
            window.location.pathname === '/main.html' ||
            window.location.pathname === '';
}

function toggleChatList() {
      if (isOnMainPage()) {
            alert("You need to be in a study sesstion, hint: click Launch Study Session");
            return;
      }
}
function toggleUserList() {
      if (isOnMainPage()) {
            alert("You need to be in a study sesstion, hint: click Launch Study Session");
            return;
      }
}

