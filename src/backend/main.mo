import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    registeredAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
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

  // Chat types
  public type Message = {
    timestamp : Time.Time;
    author : Principal;
    text : Text;
  };

  let messages = List.empty<Message>();

  public shared ({ caller }) func postMessage(text : Text) : async () {
    // Require authenticated user to post messages
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
    // Require authenticated user to view messages
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view messages");
    };
    messages.toArray();
  };

  // Data entry submission types
  public type DataEntry = {
    timestamp : Time.Time;
    author : Principal;
    key : Text;
    value : Text;
  };

  let dataEntries = Map.empty<Principal, List.List<DataEntry>>();

  public shared ({ caller }) func submitEntry(key : Text, value : Text) : async () {
    // Require authenticated user to submit data entries
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
    // Require authenticated user to list their entries
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

  // Admin functions for system management
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
};
