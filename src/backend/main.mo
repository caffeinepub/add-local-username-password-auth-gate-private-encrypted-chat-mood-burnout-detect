import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



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

  public type MoodTemplates = {
    reassuranceTemplates : List.List<Text>;
    insightTemplates : List.List<Text>;
  };

  // Comparison function for MoodCategory
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

  let moodCategoryTemplates = Map.empty<MoodCategory, MoodTemplates>();
  let sessionRequests = List.empty<SessionRequest>();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let dataEntries = Map.empty<Principal, List.List<DataEntry>>();
  let messages = List.empty<Message>();
  let encryptedMessages = List.empty<EncryptedMessage>();

  public func initializeMoodCategoryTemplates() {
    moodCategoryTemplates.add(
      #anxiety,
      {
        reassuranceTemplates = List.fromArray([
          "It's okay to feel anxious. Take a deep breath and remember you are not alone.",
          "This feeling will pass. Try to focus on what you can control right now.",
          "Acknowledging your anxiety is the first step to managing it.",
          "Consider reaching out to someone you trust for support.",
        ]);
        insightTemplates = List.fromArray([
          "Identify specific triggers for your anxiety and develop coping strategies.",
          "Mindfulness practices can help ground you in the present moment.",
          "Regular exercise has been shown to reduce anxiety symptoms.",
          "Maintaining a healthy sleep routine can improve anxiety management.",
        ]);
      },
    );

    moodCategoryTemplates.add(
      #depression,
      {
        reassuranceTemplates = List.fromArray([
          "Remember, you're not alone in this. There are people who care about you.",
          "It's okay to ask for help. Small steps count as progress.",
          "Try to be gentle with yourself today. You deserve compassion.",
          "Things can and do get better, even if it doesn't feel like it right now.",
        ]);
        insightTemplates = List.fromArray([
          "Regular physical activity can help alleviate depressive symptoms.",
          "Connecting with supportive people can improve your mood.",
          "Setting small achievable goals can help you feel more in control.",
          "Therapeutic techniques like CBT have proven effective for depression.",
        ]);
      },
    );

    moodCategoryTemplates.add(
      #stress,
      {
        reassuranceTemplates = List.fromArray([
          "Stress is a natural response. Take a moment to breathe and regroup.",
          "Prioritize what needs to be done first, and don't hesitate to ask for help.",
          "Remember to take breaks and practice self-care.",
          "You've handled tough situations before, and you can do it again.",
        ]);
        insightTemplates = List.fromArray([
          "Effective time management can help reduce stress levels.",
          "Physical activity and relaxation techniques can combat stress.",
          "Healthy communication can prevent misunderstandings and stress.",
          "Mindfulness meditation is a proven stress-reduction method.",
        ]);
      },
    );

    moodCategoryTemplates.add(
      #neutral,
      {
        reassuranceTemplates = List.fromArray([
          "It's perfectly normal to have ups and downs. Take things one step at a time.",
          "Reflect on your achievements, no matter how small.",
          "Maintaining balance is important. Try to incorporate activities you enjoy.",
          "Stay connected with supportive people in your life.",
        ]);
        insightTemplates = List.fromArray([
          "Keeping a journal can help track and understand your feelings.",
          "Mindfulness can increase awareness and emotional stability.",
          "Trying new hobbies can improve overall life satisfaction.",
          "Listening to others' experiences can help you learn and grow.",
        ]);
      },
    );

    moodCategoryTemplates.add(
      #positive,
      {
        reassuranceTemplates = List.fromArray([
          "Keep up the good work! Remember to take time to celebrate your successes.",
          "Share your positivity with others – it can have a ripple effect.",
          "Gratitude practices can help maintain a positive outlook.",
          "Balance your positive energy with self-care and rest.",
        ]);
        insightTemplates = List.fromArray([
          "Practicing gratitude has been shown to increase happiness.",
          "Physical exercise can enhance mood delivery.",
          "Helping others is linked to increased personal joy.",
          "Building good habits strengthens well-being.",
        ]);
      },
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

  public shared ({ caller }) func listEntries() : async [DataEntry] {
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

  public query ({ caller }) func getTemplatesForCategory(category : MoodCategory) : async ?{
    reassuranceTemplates : [Text];
    insightTemplates : [Text];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access templates");
    };

    switch (moodCategoryTemplates.get(category)) {
      case (?templates) {
        ?{
          reassuranceTemplates = templates.reassuranceTemplates.toArray();
          insightTemplates = templates.insightTemplates.toArray();
        };
      };
      case (null) { null };
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
};
