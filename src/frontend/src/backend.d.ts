import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface DataEntry {
    key: string;
    value: string;
    author: Principal;
    timestamp: Time;
}
export interface Message {
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface EncryptedMessage {
    author?: Principal;
    timestamp: Time;
    encryptedText: Uint8Array;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMessages(): Promise<void>;
    getAllMessages(): Promise<Array<Message>>;
    getAllSessionRequests(): Promise<Array<SessionRequest>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMySessionRequests(): Promise<Array<SessionRequest>>;
    getRecentEncryptedMessages(count: bigint): Promise<Array<EncryptedMessage>>;
    getRecentMessages(_count: bigint): Promise<Array<Message>>;
    getSessionRequestsByCategory(category: MoodCategory): Promise<Array<SessionRequest>>;
    getSystemStats(): Promise<{
        totalEntries: bigint;
        totalMessages: bigint;
        totalUsers: bigint;
    }>;
    getTemplatesForCategory(category: MoodCategory): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listEntries(): Promise<Array<DataEntry>>;
    postEncryptedMessage(encryptedText: Uint8Array): Promise<void>;
    postMessage(text: string): Promise<void>;
    requestSession(category: MoodCategory, message: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEntry(key: string, value: string): Promise<void>;
}
