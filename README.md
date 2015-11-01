A quick userscript for Chrome / Tampermonkey I threw together at a work hackathon.

Takes names and emails on an interviewzen dashboard, and replaces all but the first characters with dashes. The goal is to prevent unconscious biases against candidates based on information inferred from their name. For example,

`<a href="/interview/12ABcdE">John Doe</a>, johnny@gmail.com (103:21)`

will become

`<a href="/interview/12ABcdE">01: J--- D--</a>, j-----@g----.c-- (103:21)`

Note that a zero-padded ID is prepended to the name to help in differentiating candidates on the page.

## TODOs
- May want to normalize the length of names within a small variation, as information can be inferred from the number of characters in a name
