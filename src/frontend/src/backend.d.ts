import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ClientSessionSummaryView {
    client: Principal;
    moodDistribution: Array<MoodCount>;
    sessionCount: bigint;
    totalMinutes: bigint;
}
export type Time = bigint;
export interface DataEntry {
    key: string;
    value: string;
    read: boolean;
    author: Principal;
    timestamp: Time;
}
export interface SessionNote {
    id: bigint;
    client: Principal;
    content: string;
    author: Principal;
    timestamp: Time;
    sessionId: bigint;
}
export interface MoodCount {
    count: bigint;
    category: MoodCategory;
}
export interface InboxMessage {
    id: bigint;
    status: MessageStatus;
    content: string;
    recipient: Principal;
    sender: Principal;
    timestamp: Time;
    replyTo?: bigint;
    threadId: bigint;
}
export interface TherapySessionData {
    moodCategory: MoodCategory;
    durationMinutes: bigint;
    notes: string;
    timestamp: Time;
}
export interface Notification {
    id: bigint;
    read: boolean;
    recipient: Principal;
    message: string;
    timestamp: Time;
}
export interface EncryptedMessage {
    author?: Principal;
    timestamp: Time;
    encryptedText: Uint8Array;
}
export interface Message {
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    email: string;
    registeredAt: Time;
}
export interface SessionRequest {
    message: string;
    timestamp: Time;
    category: MoodCategory;
    caller: Principal;
}
export enum MessageStatus {
    read = "read",
    unread = "unread",
    archived = "archived"
}
export enum MoodCategory {
    stress = "stress",
    anxiety = "anxiety",
    depression = "depression",
    positive = "positive",
    neutral = "neutral"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSessionNote(client: Principal, content: string, sessionId: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMessages(): Promise<void>;
    getAllClientSummaries(): Promise<Array<ClientSessionSummaryView>>;
    getAllEntries(): Promise<Array<[Principal, Array<DataEntry>]>>;
    getAllMessages(): Promise<Array<Message>>;
    getAllSessionRequests(): Promise<Array<SessionRequest>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientSummary(client: Principal): Promise<ClientSessionSummaryView | null>;
    getEntriesForUser(user: Principal): Promise<Array<DataEntry>>;
    getInboxMessagesForUser(user: Principal): Promise<Array<InboxMessage>>;
    getMySessionRequests(): Promise<Array<SessionRequest>>;
    getMyTherapySessions(): Promise<Array<TherapySessionData>>;
    getNotificationsForUser(user: Principal): Promise<Array<Notification>>;
    getRecentEncryptedMessages(count: bigint): Promise<Array<EncryptedMessage>>;
    getRecentMessages(_count: bigint): Promise<Array<Message>>;
    getSessionNotesForClient(client: Principal): Promise<Array<SessionNote>>;
    getSessionRequestsByCategory(category: MoodCategory): Promise<Array<SessionRequest>>;
    getSystemStats(): Promise<{
        totalEntries: bigint;
        totalMessages: bigint;
        totalUsers: bigint;
    }>;
    getTemplatesForCategory(category: MoodCategory): Promise<Array<string>>;
    getUnreadEntriesCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeReassuranceTemplates(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listEntries(): Promise<Array<DataEntry>>;
    markEntryAsRead(user: Principal, entryIndex: bigint): Promise<void>;
    markMessageAsRead(messageId: bigint): Promise<void>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    postEncryptedMessage(encryptedText: Uint8Array): Promise<void>;
    postMessage(text: string): Promise<void>;
    recordTherapySession(durationMinutes: bigint, moodCategory: MoodCategory, notes: string): Promise<void>;
    requestSession(category: MoodCategory, message: string): Promise<void>;
    respondToMessage(target: Principal, text: string, threadId: bigint | null, replyTo: bigint | null): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendInboxMessage(recipient: Principal, content: string, threadId: bigint | null, replyTo: bigint | null): Promise<bigint>;
    sendNotification(recipient: Principal, message: string): Promise<void>;
    submitEntry(key: string, value: string): Promise<void>;
}
