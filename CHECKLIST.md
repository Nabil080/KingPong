# Comprehensive Website Testing Checklist

- spectator
> spectator count / notif for players
> live update when someone is playing
> playing users on top

## 1. Authentication & Authorization
- [x] Register with valid credentials
- [x] Register with invalid credentials (short password, invalid email, etc.)
- [x] Register with existing username/email
- [x] Register with/without avatar
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Login with incorrect password
- [x] Login with non-existent user
- [x] Login with Google (if available) <!-- NOTE: Only work if the url is https://localhost:3000, does not work on remote machine -->
- [x] Logout functionality
- [x] Session persistence after refresh
- [x] Session expiration (auto logout)
- [x] Access protected pages when not logged in
- [x] Access public pages when logged in

## 2. Profile Management
- [x] View own profile
- [x] Edit username  <!-- FIXED: Input is not sanitized (exemple: <>bla<> works and breaks the site)--> 
- [x] Edit avatar 
    - [x] Upload
    - [x] Invalide file type
    - [x] Large file
- [x] Edit password 
    - [x] Incorrect old password
    - [x] Incorrect new password
    - [x] Correct case
- [x] View other users’ profiles
- [x] View profile stats (games played, wins, losses, etc.)
- [x] View match history in profile
- [x] Delete account (confirmation, data removal, logout after deletion)

## 3. Friend System
- [x] Add friend
- [x] Remove friend
- [x] View friends list

## 4. Block System
- [x] Block a user
- [x] Unblock a user <!-- NOTE: closes the popup, kinda annoying -->
- [x] View blocked users list <!-- FIXED: Bad view when there are too many blocked users -->
- [x] Blocked user cannot send messages
- [x] Blocked user cannot invite to game
- [x] Unblock restores previous permissions

## 5. Game Features
- [x] Start a new Pong game (vs local player)
- [x] Start a new Pong game (vs bot)
- [x] Game cancellable at any moment
- [x] Game pausable
- [x] Start a new Pong game (vs remote user) :
    - [x] Invites :
        - [x] Invite remote user to a game
        - [x] Accept
        - [x] Decline
        - [x] Cancel game invite <!-- FIXED: Remote users gets a notification but if he clicks on it he is still redirected to the lobby -->
        - [x] Can't invite someone else while an invite is pending <!-- FIXED: We can't start a local game but we can invite someone through the battle button on his player card, this does not cancel the invitation for the first opponent -->
    - [x] Ready-step :
        - [x] Wait for opponent to join
        - [x] Handle disconnect  <!-- NOTE: Does not stop the game, we can force the ready state to be false when someone disconnects but not important -->
        - [x] Handle cancel from any user
        - [x] Update the state for both users
        - [x] Game starts when both are ready
    - [x] Playing-step :
        - [x] Handle disconnect <!-- NOTE: The disconnect user can connect back in, can be improved but not important -->
        - [x] Handle Give up
        - [x] Client lag doesn't impact the real game <!-- NOTE: If a client loses the connection, we will keep updating the game locally but as soon as he gets the connection back the server will send the true gamestate and it will override what the client had calculated while disconnected (bad long dsl) -->
    - [x] Done-step :
        - [x] Max score detection
        - [x] Correct winner
        - [x] Game stats update after match (Stats and history)
        - [x] Rematch option with same config

## 6. Tournament Features
- [x] Create a 4 player tournament
- [x] Bots can be selected
- [x] Cancel tournament at any time
- [x] Game options can only be changed at the start
- [x] View tournament bracket
- [x] Play tournament match
- [x] Advance in tournament after win
- [x] Tournament ends and winner is displayed

## 7. Match History & Stats
- [x] View match history (chronological order)
- [x] View match details (score, opponent, date) <!-- NOTE: Missing duration -->
- [x] View stats (total games, wins, losses, win rate...) <!-- NOTE: Maybe make dummy matches differ between opponents -->
- [x] Stats update after each game

## 8. Notifications
- [x] Receive notification logging in
- [x] Receive notification logging out
- [x] Receive notification for game invite
- [x] Receive notification for game invite cancelled <!-- FIXED: Notification is clickable and redirects to the cancelled game -->
- [x] Receive notification for game accepted
- [x] Receive notification for game rejected
- [x] Receive notification for chat message
- [x] Delete notification
- [x] No duplicate notification from the same user
- [ ] Correct background color for the different types

## 9. Navigation & UI/UX <!-- Not important i guess -->
- [x] Navbar displays correct options (logged in/out)
- [x] Navigate between all pages (Home, Profile, Friends, Tournaments, Game, History, Settings, etc.)
- [x] All buttons and links work
- [x] Popups/modal dialogs open/close correctly
- [ ] Keyboard navigation (tab, enter, escape) / Focus management for accessibility
    - [x] Navbar buttons <!-- FIXED: Connect/settings button not selectable -->
    - [x] Homepage buttons
    - [ ] PlayerCard buttons <!-- events button not selectable, clickable player aswell (in history and gameboard too, should wrap in an anchor or a button)-->
    - [x] Gameboard buttons
    - [x] ConnectButton

## 10. Settings & Preferences
- [x] Change language
- [x] Live update without reload <!-- NOTE: No live update for notifications but whatever -->
- [x] Language persists after reload

## 11. Online Status & Real-Time Features
- [x] See online/offline status of users
- [x] Status updates in real-time
- [x] User appears offline after logout/disconnect
- [x] Real-time updates for friends list
- [x] Real-time chat message
- [x] Real-time pong gamestate updates

## 12. Error Handling & Feedback
- [x] Invalid form input shows error messages
- [x] Server errors display user-friendly messages <!-- NOTE: Server messages aren't precise however we have client side handling which is precise enough on most cases -->
- [x] 404 page for invalid routes

## 13. Security
- [x] Passwords are not visible in forms
- [x] Cannot access other users’ private data
- [x] CSRF protection: 
    - [x] HTTP <!-- NOTE: Giving a signed jwt on login -->
    - [x] WS
- [x] XSS protection (input sanitization):
    - [x] Register <!-- FIXED: server side isn't fully secured (does not check alnum / length post sanitize)-->
    - [x] Edit profile <!-- FIXED: client and server side not secure (exemple: <>bla<> breaks the site) -->
    - [x] Chat <!-- NOTE: client side safety with innerText -->
- [x] SQL injection protection <!-- NOTE: Using bind parameters on every query -->
- [x] Secure cookies and session storage <!-- no idea, we use fastify and the browser methods -->

## 14. Performance
- [x] Fast page load times <!-- NOTE: Huge history may take time since there is no pagination/limit -->
- [x] Lazy loading of images/content  <!-- ignored -->
- [x] No memory leaks (check with dev tools) <!-- On est en C ouuuuuuu ? -->
- [x] Efficient WebSocket connection handling  <!-- ignored -->

## 15. Miscellaneous
- [x] Favicon displays correctly
- [x] Page titles update correctly
- [x] Meta tags for SEO <!-- RIP: y'a pas une balise <h> le site est finito pipo -->
- [x] Confidentiality Policy should be updated to include localstorage : jwt, lang pref, options pref (also game duration but less important)
- [x] Essayer de changer de police pour un meilleur rendu
- [ ] Get ready of the evaluation o.o

## 16. Missing Traductions
- [x] deleteAccountConfirmation (french for sure)
- [ ] LocalStorage section in confidentiality policy

## 17. Bonuses
- [x] Ajouter un theme en option similairement au language. On peut commencer avec un seul theme alternatif dans un premier temps
- [x] Pour que la polar area chart (most played users) soit plus agreable a voir en correction,
on peut faire varier le nombre de games contre chaque user dans seed.ts
- [ ] Network disconnect/reconnect handling <!-- The client does nothing special when the connection to the server is lost, there is no way to know if the server is active or not. Maybe polling with error 500 page would fix this-->
- [ ] 500 page for server internal error <!-- ignored -->
