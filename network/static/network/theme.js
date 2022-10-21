const light = document.querySelector('.choose-theme .light')
const dark = document.querySelector('.choose-theme .dark')

const setTheme = theme =>{
	if(theme == 'dark'){
		document.querySelector('body').classList.add('theme-dark')
		light.classList.remove('active')
		dark.classList.add('active')
	}else{
		document.querySelector('body').classList.remove('theme-dark')
		light.classList.add('active')
		dark.classList.remove('active')
	}

	setCookie('theme',theme,7);
}

const refreshTheme = () => {
	const nowTheme = getCookie('theme')
	setTheme(nowTheme)
}
refreshTheme()


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

