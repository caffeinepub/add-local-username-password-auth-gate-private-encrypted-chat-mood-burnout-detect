import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


// Specify the migration function in the with clause.

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    registeredAt : Time.Time;
  };

  public type Message = {
    timestamp : Time.Time;
    author : Principal;
    text : Text;
  };

  public type DataEntry = {
    timestamp : Time.Time;
    author : Principal;
    key : Text;
    value : Text;
    read : Bool;
  };

  public type EncryptedMessage = {
    timestamp : Time.Time;
    author : ?Principal;
    encryptedText : Blob;
  };

  public type MoodCategory = {
    #anxiety;
    #depression;
    #stress;
    #neutral;
    #positive;
  };

  public type SessionRequest = {
    caller : Principal;
    timestamp : Time.Time;
    category : MoodCategory;
    message : Text;
  };

  public type MoodCount = {
    category : MoodCategory;
    count : Nat;
  };

  public type TherapySessionData = {
    timestamp : Time.Time;
    durationMinutes : Nat;
    moodCategory : MoodCategory;
    notes : Text;
  };

  public type ClientSessionSummaryView = {
    client : Principal;
    sessionCount : Nat;
    totalMinutes : Nat;
    moodDistribution : [MoodCount];
  };

  module MoodCategory {
    public func compare(a : MoodCategory, b : MoodCategory) : { #less; #equal; #greater } {
      switch (a, b) {
        case (#anxiety, #anxiety) { #equal };
        case (#anxiety, _) { #less };
        case (#depression, #anxiety) { #greater };
        case (#depression, #depression) { #equal };
        case (#depression, _) { #less };
        case (#stress, #anxiety) { #greater };
        case (#stress, #depression) { #greater };
        case (#stress, #stress) { #equal };
        case (#stress, _) { #less };
        case (#neutral, #positive) { #less };
        case (#neutral, #neutral) { #equal };
        case (#neutral, _) { #greater };
        case (#positive, #positive) { #equal };
        case (#positive, _) { #greater };
      };
    };
  };

  var reassuranceTemplates : Map.Map<MoodCategory, List.List<Text>> = Map.empty();
  let sessionRequests = List.empty<SessionRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let dataEntries = Map.empty<Principal, List.List<DataEntry>>();
  let messages = List.empty<Message>();
  let encryptedMessages = List.empty<EncryptedMessage>();
  let therapySessions = Map.empty<Principal, List.List<TherapySessionData>>();

  public type MessageStatus = {
    #unread;
    #read;
    #archived;
  };

  public type InboxMessage = {
    id : Nat;
    sender : Principal;
    recipient : Principal;
    timestamp : Time.Time;
    content : Text;
    threadId : Nat;
    replyTo : ?Nat;
    status : MessageStatus;
  };

  var nextMessageId = 1;
  let inboxMessages = Map.empty<Nat, InboxMessage>();
  var nextThreadId = 1;
  let notifications = List.empty<Notification>();
  let sessionNotes = Map.empty<Principal, List.List<SessionNote>>();

  public type Notification = {
    id : Nat;
    recipient : Principal;
    timestamp : Time.Time;
    message : Text;
    read : Bool;
  };

  public type SessionNote = {
    id : Nat;
    author : Principal;
    client : Principal;
    timestamp : Time.Time;
    content : Text;
    sessionId : Nat;
  };

  var nextNotificationId = 1;
  var nextSessionNoteId = 1;
  var nextSessionId = 1;

  public func initializeReassuranceTemplates() {
    reassuranceTemplates.add(
      #anxiety,
      List.fromArray(
        [
          "It's okay to feel anxious. Take a deep breath and remember you are not alone.",
          "This feeling will pass. Try to focus on what you can control right now.",
          "Acknowledging your anxiety is the first step to managing it.",
          "Consider reaching out to someone you trust for support.",
          "While it may feel overwhelming now, try to remember that anxiety is just one part of your experience. Take it one moment at a time.",
          "Allow yourself to recognize these feelings without judgment. Sometimes gentle acceptance is the first step toward finding relief.",
          "Your anxiety doesn't define you or your capabilities – everyone struggles sometimes. Give yourself permission to rest and recover.",
          "There are many healthy ways to manage anxiety. If you're struggling, consider professional help or trusted support networks.",
        ],
      ),
    );

    reassuranceTemplates.add(
      #depression,
      List.fromArray(
        [
          "Remember, you're not alone in this. There are people who care about you.",
          "It's okay to ask for help. Small steps count as progress.",
          "Try to be gentle with yourself today. You deserve compassion.",
          "Things can and do get better, even if it doesn't feel like it right now.",
          "If you're feeling low, remember to try to meet your basic needs first. Little acts of self-care can make a difference.",
          "It's okay to take things at your own pace. Sometimes the smallest acts of self-kindness have a big impact.",
          "While depression may tell you that things won't change, feelings are temporary and help is available.",
          "You're worthy of support, and there's always a way forward even if you can't see it right now.",
        ],
      ),
    );

    reassuranceTemplates.add(
      #stress,
      List.fromArray(
        [
          "Stress is a natural response. Take a moment to breathe and regroup.",
          "Prioritize what needs to be done first, and don't hesitate to ask for help.",
          "Remember to take breaks and practice self-care.",
          "You've handled tough situations before, and you can do it again.",
          "It's normal to feel overwhelmed sometimes – try breaking tasks down into smaller, manageable steps.",
          "Make space for yourself when you can, even if it's just a few minutes of quiet time.",
          "Stress doesn't have to be negative. With the right coping strategies, you can manage it effectively.",
          "Don't forget you have a support network around you. Reach out when things get overwhelming.",
        ],
      ),
    );

    reassuranceTemplates.add(
      #neutral,
      List.fromArray(
        [
          "It's perfectly normal to have ups and downs. Take things one step at a time.",
          "Reflect on your achievements, no matter how small.",
          "Maintaining balance is important. Try to incorporate activities you enjoy.",
          "Stay connected with supportive people in your life.",
          "A neutral mood is a healthy starting point. Use this as an opportunity to incorporate positive habits and self-care strategies.",
          "Try to maintain a balanced diet, regular exercise, and consistent sleep patterns to support your well-being.",
          "Growth often happens slowly. Allow your moods to flow naturally without forcing changes.",
          "Neutral days can provide a sense of stability. Make use of this time to recharge and plan ahead if you feel up to it.",
        ],
      ),
    );

    reassuranceTemplates.add(
      #positive,
      List.fromArray(
        [
          "Keep up the good work! Remember to take time to celebrate your successes.",
          "Share your positivity with others – it can have a ripple effect.",
          "Gratitude practices can help maintain a positive outlook.",
          "Balance your positive energy with self-care and rest.",
          "Positive moods benefit your mental and physical health. Take this time to create memories and foster meaningful connections.",
          "Use your positive energy to approach new challenges and try new activities.",
          "Be grateful for the present while remaining grounded. Recognize achievements, big and small.",
          "Celebrate your successes, but remember to rest and care for yourself along the way.",
        ],
      ),
    );
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func postMessage(text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post messages");
    };

    if (text.size() > 280) {
      Runtime.trap("Character limit exceeded! The maximum limit for a single chat message is 280 characters.");
    };

    let message = {
      timestamp = Time.now();
      author = caller;
      text;
    };

    messages.add(message);
  };

  public query ({ caller }) func getRecentMessages(_count : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view messages");
    };
    messages.toArray();
  };

  public shared ({ caller }) func postEncryptedMessage(encryptedText : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post encrypted messages");
    };

    if (encryptedText.size() > 1000) {
      Runtime.trap("Message too large. The maximum limit for encrypted messages is 1000 bytes.");
    };

    let encryptedMessage : EncryptedMessage = {
      timestamp = Time.now();
      author = ?caller;
      encryptedText;
    };

    encryptedMessages.add(encryptedMessage);
  };

  public query ({ caller }) func getRecentEncryptedMessages(count : Nat) : async [EncryptedMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view encrypted messages");
    };

    let totalMessages = encryptedMessages.size();
    let actualCount = if (count > totalMessages) { totalMessages } else { count };

    var start = 0;
    if (totalMessages > count) {
      start := totalMessages - count;
    };

    let messagesArray = encryptedMessages.toArray();
    messagesArray.sliceToArray(start, start + actualCount);
  };

  public shared ({ caller }) func submitEntry(key : Text, value : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit entries");
    };

    let entry = {
      key;
      value;
      author = caller;
      timestamp = Time.now();
      read = false;
    };

    switch (dataEntries.get(caller)) {
      case (null) {
        let newList = List.empty<DataEntry>();
        newList.add(entry);
        dataEntries.add(caller, newList);
      };
      case (?existingList) {
        existingList.add(entry);
      };
    };
  };

  public query ({ caller }) func listEntries() : async [DataEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list entries");
    };

    switch (dataEntries.get(caller)) {
      case (?entriesList) {
        entriesList.toArray();
      };
      case (null) { [] };
    };
  };

  // Admin-only: View all data entries (therapist inbox)
  public query ({ caller }) func getAllEntries() : async [(Principal, [DataEntry])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all entries");
    };

    let result = List.empty<(Principal, [DataEntry])>();
    for ((principal, entriesList) in dataEntries.entries()) {
      result.add((principal, entriesList.toArray()));
    };
    result.toArray();
  };

  // Admin-only: View entries for a specific user
  public query ({ caller }) func getEntriesForUser(user : Principal) : async [DataEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view entries for other users");
    };

    switch (dataEntries.get(user)) {
      case (?entriesList) {
        entriesList.toArray();
      };
      case (null) { [] };
    };
  };

  // Admin-only: Mark an entry as read
  public shared ({ caller }) func markEntryAsRead(user : Principal, entryIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark entries as read");
    };

    switch (dataEntries.get(user)) {
      case (?entriesList) {
        let entriesArray = entriesList.toArray();
        if (entryIndex >= entriesArray.size()) {
          Runtime.trap("Invalid entry index");
        };

        let updatedList = List.empty<DataEntry>();
        var i = 0;
        while (i < entriesArray.size()) {
          if (i == entryIndex) {
            let updatedEntry = {
              entriesArray[i] with read = true
            };
            updatedList.add(updatedEntry);
          } else {
            updatedList.add(entriesArray[i]);
          };
          i += 1;
        };

        dataEntries.add(user, updatedList);
      };
      case (null) {
        Runtime.trap("No entries found for user");
      };
    };
  };

  // Admin-only: Get count of unread entries across all users
  public query ({ caller }) func getUnreadEntriesCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view unread entries count");
    };

    var unreadCount = 0;
    for ((_, entriesList) in dataEntries.entries()) {
      let entriesArray = entriesList.toArray();
      var i = 0;
      while (i < entriesArray.size()) {
        if (not entriesArray[i].read) {
          unreadCount += 1;
        };
        i += 1;
      };
    };
    unreadCount;
  };

  public query ({ caller }) func getAllUsers() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.keys().toArray();
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all messages");
    };
    messages.toArray();
  };

  public shared ({ caller }) func clearMessages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear messages");
    };
    messages.clear();
  };

  public query ({ caller }) func getSystemStats() : async {
    totalUsers : Nat;
    totalMessages : Nat;
    totalEntries : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view system stats");
    };

    var totalEntries = 0;
    for ((_, entriesList) in dataEntries.entries()) {
      totalEntries += entriesList.size();
    };

    {
      totalUsers = userProfiles.size();
      totalMessages = messages.size();
      totalEntries;
    };
  };

  public query ({ caller }) func getTemplatesForCategory(category : MoodCategory) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access reassurance templates");
    };

    switch (reassuranceTemplates.get(category)) {
      case (?templates) { templates.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func requestSession(category : MoodCategory, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request sessions");
    };

    let sessionRequest : SessionRequest = {
      caller;
      timestamp = Time.now();
      category;
      message;
    };

    sessionRequests.add(sessionRequest);
  };

  public query ({ caller }) func getMySessionRequests() : async [SessionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view session requests");
    };

    let requestsArray = sessionRequests.toArray();
    let myRequests = List.empty<SessionRequest>();

    var i = 0;
    while (i < requestsArray.size()) {
      if (requestsArray[i].caller == caller) {
        myRequests.add(requestsArray[i]);
      };
      i += 1;
    };

    myRequests.toArray();
  };

  public query ({ caller }) func getAllSessionRequests() : async [SessionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all session requests");
    };

    sessionRequests.toArray();
  };

  public query ({ caller }) func getSessionRequestsByCategory(category : MoodCategory) : async [SessionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view session requests by category");
    };

    let requestsArray = sessionRequests.toArray();
    let filteredArray = List.empty<SessionRequest>();

    var i = 0;
    while (i < requestsArray.size()) {
      if (requestsArray[i].category == category) {
        filteredArray.add(requestsArray[i]);
      };
      i += 1;
    };

    filteredArray.toArray();
  };

  public shared ({ caller }) func recordTherapySession(durationMinutes : Nat, moodCategory : MoodCategory, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record therapy sessions");
    };

    let sessionData : TherapySessionData = {
      timestamp = Time.now();
      durationMinutes;
      moodCategory;
      notes;
    };

    switch (therapySessions.get(caller)) {
      case (null) {
        let newList = List.empty<TherapySessionData>();
        newList.add(sessionData);
        therapySessions.add(caller, newList);
      };
      case (?existingList) {
        existingList.add(sessionData);
      };
    };
  };

  public query ({ caller }) func getMyTherapySessions() : async [TherapySessionData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view therapy sessions");
    };

    switch (therapySessions.get(caller)) {
      case (?sessionsList) {
        sessionsList.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func getClientSummary(client : Principal) : async ?ClientSessionSummaryView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view client session summaries");
    };

    switch (therapySessions.get(client)) {
      case (?sessionsList) {
        var totalMinutes = 0;
        var sessionCount = 0;

        let moodStats = Map.empty<MoodCategory, Nat>();

        for (session in sessionsList.values()) {
          totalMinutes += session.durationMinutes;
          sessionCount += 1;

          let currentCount = switch (moodStats.get(session.moodCategory)) {
            case (?count) { count };
            case (null) { 0 };
          };

          moodStats.add(session.moodCategory, currentCount + 1);
        };

        let moodArray = List.empty<MoodCount>();
        for ((category, count) in moodStats.entries()) {
          moodArray.add({ category; count });
        };

        ?{
          client;
          sessionCount;
          totalMinutes;
          moodDistribution = moodArray.toArray();
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func getAllClientSummaries() : async [ClientSessionSummaryView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all client summaries");
    };

    let summariesList = List.empty<ClientSessionSummaryView>();

    for ((client, sessionsList) in therapySessions.entries()) {
      var totalMinutes = 0;
      var sessionCount = 0;

      let moodStats = Map.empty<MoodCategory, Nat>();

      for (session in sessionsList.values()) {
        totalMinutes += session.durationMinutes;
        sessionCount += 1;

        let currentCount = switch (moodStats.get(session.moodCategory)) {
          case (?count) { count };
          case (null) { 0 };
        };

        moodStats.add(session.moodCategory, currentCount + 1);
      };

      let moodArray = List.empty<MoodCount>();
      for ((category, count) in moodStats.entries()) {
        moodArray.add({ category; count });
      };

      summariesList.add({
        client;
        sessionCount;
        totalMinutes;
        moodDistribution = moodArray.toArray();
      });
    };

    summariesList.toArray();
  };

  public shared ({ caller }) func sendInboxMessage(recipient : Principal, content : Text, threadId : ?Nat, replyTo : ?Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send inbox messages");
    };

    let actualThreadId = switch (threadId) {
      case (?tid) { tid };
      case (null) {
        let newId = nextThreadId;
        nextThreadId += 1;
        newId;
      };
    };

    let message : InboxMessage = {
      id = nextMessageId;
      sender = caller;
      recipient;
      timestamp = Time.now();
      content;
      threadId = actualThreadId;
      replyTo;
      status = #unread;
    };

    inboxMessages.add(nextMessageId, message);
    let messageId = nextMessageId;
    nextMessageId += 1;
    messageId;
  };

  public query ({ caller }) func getInboxMessagesForUser(user : Principal) : async [InboxMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inbox messages");
    };

    // Users can only view their own inbox, admins can view any inbox
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own inbox");
    };

    inboxMessages.values().filter(
      func(msg) {
        msg.recipient == user;
      }
    ).toArray();
  };

  public shared ({ caller }) func markMessageAsRead(messageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark messages as read");
    };

    switch (inboxMessages.get(messageId)) {
      case (?message) {
        // Allow recipient or admin to mark as read
        if (message.recipient != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipient or an admin can mark the message as read");
        };

        let updatedMessage = {
          message with
          status = #read;
        };

        inboxMessages.add(messageId, updatedMessage);
      };
      case (null) { Runtime.trap("Message not found") };
    };
  };

  public shared ({ caller }) func sendNotification(recipient : Principal, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };

    let notification : Notification = {
      id = nextNotificationId;
      recipient;
      timestamp = Time.now();
      message;
      read = false;
    };

    notifications.add(notification);
    nextNotificationId += 1;
  };

  public query ({ caller }) func getNotificationsForUser(user : Principal) : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    // Users can only view their own notifications, admins can view any
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own notifications");
    };

    notifications.filter(
      func(notif) {
        notif.recipient == user;
      }
    ).toArray();
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    let notificationsList = notifications.toArray();
    let notificationIndex = notificationsList.findIndex(func(notif) { notif.id == notificationId });

    switch (notificationIndex) {
      case (?index) {
        let notificationsArray = notificationsList;
        
        // Verify the caller is the recipient or an admin
        if (notificationsArray[index].recipient != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipient or an admin can mark the notification as read");
        };

        var i = 0;
        while (i < notificationsArray.size()) {
          if (i == index) {
            let updatedNotification = {
              notificationsArray[i] with read = true
            };
            notifications.clear();
            var j = 0;
            while (j < notificationsArray.size()) {
              if (j == index) {
                notifications.add(updatedNotification);
              } else {
                notifications.add(notificationsArray[j]);
              };
              j += 1;
            };
            return;
          };
          i += 1;
        };
        Runtime.trap("Notification not found");
      };
      case (null) {
        Runtime.trap("Notification not found");
      };
    };
  };

  public shared ({ caller }) func addSessionNote(client : Principal, content : Text, sessionId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add session notes");
    };

    let note : SessionNote = {
      id = nextSessionNoteId;
      author = caller;
      client;
      timestamp = Time.now();
      content;
      sessionId;
    };

    switch (sessionNotes.get(client)) {
      case (null) {
        let newList = List.empty<SessionNote>();
        newList.add(note);
        sessionNotes.add(client, newList);
      };
      case (?existingList) {
        existingList.add(note);
      };
    };

    let noteId = nextSessionNoteId;
    nextSessionNoteId += 1;
    noteId;
  };

  public query ({ caller }) func getSessionNotesForClient(client : Principal) : async [SessionNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view session notes");
    };

    // Users can only view their own session notes, admins can view any
    if (caller != client and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own session notes");
    };

    switch (sessionNotes.get(client)) {
      case (?notesList) {
        notesList.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func respondToMessage(target : Principal, text : Text, threadId : ?Nat, replyTo : ?Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can respond to messages");
    };

    let actualThreadId = switch (threadId) {
      case (?tid) { tid };
      case (null) {
        let newId = nextThreadId;
        nextThreadId += 1;
        newId;
      };
    };

    let message : InboxMessage = {
      id = nextMessageId;
      sender = caller;
      recipient = target;
      timestamp = Time.now();
      content = text;
      threadId = actualThreadId;
      replyTo;
      status = #unread;
    };

    inboxMessages.add(nextMessageId, message);
    let messageId = nextMessageId;
    nextMessageId += 1;

    // Mark the original message as read if replying to one
    switch (replyTo) {
      case (?msgId) {
        switch (inboxMessages.get(msgId)) {
          case (?originalMessage) {
            let updatedMessage = {
              originalMessage with
              status = #read;
            };
            inboxMessages.add(msgId, updatedMessage);
          };
          case (null) {};
        };
      };
      case (null) {};
    };

    messageId;
  };
};
