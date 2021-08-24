/**
 * @fileoverview Messages needed for command router.
 */

const messages = (module.exports = {});

messages.help = () =>
  `Available commands to members:

* \`!help\` :: This help screen.
* \`!profile [username]\` :: Show the profile of another member.
* \`!nickname [nickname]\` :: Update your nickname.
* \`!bio [bio]\` :: Update your bio, multi-line inputs are allowed.
* \`!join [Category]\` :: Join a role (more below).
* \`!part [Category]\` :: Leave a role (more below).

We use Roles to be able to mention groups of users. Today, the Available` +
  ` Roles in this server are:

* \`Space\` Add this role if you want to be notified of space events` +
  `(launches, live events, etc).`;

messages.error = () =>
  'Unknown command, type `!help` for a list of available commands.';
