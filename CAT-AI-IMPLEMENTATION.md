# CAT AI Implementation Plan

## Objective
Implement a CAT-specific AI chatbot with a chat interface, history, and question suggestions, accessible from the homepage via an "Ask CAT AI" button.

## Current Status
The user states that the "Ask CAT AI" button on the homepage does not redirect to an AI interface. The website is 80% complete.

## Plan

1.  **Verify existing "Ask CAT AI" button:**
    *   Locate the `AIChatButton` component in `components/ai-chat-button.tsx`.
    *   Confirm the `href` attribute of the `motion.button` component is set to `/cat-ai`.
    *   The button currently redirects to `/cat-ai`.

2.  **Create a new page for the CAT AI chat interface:**
    *   Create `app/cat-ai/page.tsx` to serve as the main page for the CAT AI chatbot.

3.  **Design and implement the CAT AI chat interface (frontend):**
    *   Create `components/cat-ai-chat-interface.tsx` for the chat UI, including input field, send button, and message display.
    *   Create `components/cat-ai-chat-history.tsx` to display past messages and manage chat sessions.

4.  **Develop the backend API for the CAT AI chatbot:**
    *   Create `app/api/cat-ai/chat/route.ts` to handle AI chat requests and responses.
    *   Implement logic to interact with an external AI service (e.g., Google Gemini, OpenAI).
    *   **Install Google Generative AI SDK:** `npm install @google/generative-ai` (Completed)

5.  **Integrate chat history functionality:**
    *   Connect the `cat-ai-chat-history` component with the backend API to fetch and display chat history.
    *   Implement saving new messages to the history.

6.  **Add question suggestion functionality:**
    *   Implement logic within the `cat-ai-chat-interface` to provide context-aware question suggestions.

7.  **Link the "Ask CAT AI" button to the new CAT AI chat page:**
    *   Ensure the `href` in `components/ai-chat-button.tsx` correctly points to `/cat-ai` (already verified).

