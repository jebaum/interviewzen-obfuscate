// ==UserScript==
// @name         obfuscate interviewzen
// @namespace    http://amazon.com/
// @version      1.0
// @description  remove identifying info from interviewzen dashboard
// @author       James
// @match        https://*.interviewzen.com/dashboard/*
// ==/UserScript==

// TODO - probably want to normalize length, as that can also give away some info

/* example element text:
 *    <a href="/interview/12ABcdE">John Doe</a>, johnny@gmail.com (103:21)
 *
 * ugly regex that didn't work 100% due to emails not always being present:
 *    /(<a href=.+interview.+">)(.+)<\/a>,*\s*(.+)@(.+)\..+\s*\((\d+:\d+)\)/g
 *
 * not all entries have the comma and email
 * urls always seem to be 2 numbers and then 5 mixed case letters, but not gonna count on it
 */

function main() {
    var elements = document.getElementById('responses').getElementsByClassName('name');
    for (var i = 0; i < elements.length; i++) {
        // extract information
        var html  = elements[i].innerHTML;
        var time  = html.match(/\d+:\d+/)[0];
        var email = html.match(/\S+@\S+\.\S+/);

        // add incrementing ID to help more easily identify candidates
        var obfuscated = pad(i + 1, elements.length) + ': ';

        // replace the hyperlink containing candidate name
        obfuscated += html.replace(/(<a href=.+interview.+">)(.+)<\/a>.*/g, changeName);

        // if candidate has an email listed, obfuscate that as well
        obfuscated += email ? ', ' + changeEmail(email[0]) + ' ' : '';

        // add in candidate time and make the change
        elements[i].innerHTML = obfuscated + ' (' + time + ')';
    }
}

function changeName(match, anchorTag, name) {
    var replaceNextChar = false;
    for (var i = 0; i < name.length; i++) {
        if (name[i] === ' ') { // if we've hit a space, we don't want to replace the next char
            replaceNextChar = false;
        } else if (replaceNextChar) {
            name = name.replaceAt(i, '-');
        } else {                    // didn't replace current character and not at a space
            replaceNextChar = true; // so we want to replace the next char
        }
    }
    return anchorTag + name + '</a>';
}

function changeEmail(email) {
    for (var i = 1; i < email.length; i++) {
        if (email[i] !== '@' && email[i] !== '.') {
            email = email.replaceAt(i, '-');
        } else {
            i++;
        }
    }
    return email;
}

// helper function to change a character in a string
String.prototype.replaceAt = function(index, c) {
    return this.substr(0, index) + c + this.substr(index + c.length);
};

// helper function to zero-pad numbering system (for alignment)
function pad(x, max) {
    if (max < 10) {
        return x.toString();
    } else if (max < 100) {
        return (x < 10) ? ('0' + x.toString()) : x.toString();
    }
    // XXX add another case here if there's ever more than 100 candidates on a page
}


/* added a thing here to toggle visibility of the div before obfuscating information
 * if code takes a while to run, this prevents people from seeing any identifying info while it does
 * pages seem to be small, and javascript engines are fast these days, so this probably isn't necessary
 */

// var responses = document.getElementById('responses');
// responses.style.visibility = "hidden";
main();
// responses.style.visibility = "visible";
