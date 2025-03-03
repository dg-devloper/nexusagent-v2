# Modern Chat UI with Enhanced Result Visualization

This is a modern chat UI implementation with enhanced result visualization, designed to match the layout shown in the reference images. The UI provides a rich user experience with features like streaming responses, result tables, search status indicators, and more.

## Key Features

1. **Modern Message Bubble Layout**

    - User messages with avatar on left, message content in gradient bubble
    - Assistant messages with avatar on right, message content in white bubble
    - Special formatting for result messages with tables and search status
    - Compact avatars (32px) with rounded corners (8px)

2. **Result Components**

    - `ResultHeader`: Shows "Results" with a "Show steps" button
    - `SearchStatus`: Displays search progress with steps like "Searching examples and definitions"
    - `ResultTable`: Renders tabular data with proper formatting for columns and rows

3. **Agent Reasoning**

    - `AgentReasoningView`: Displays detailed agent reasoning data with expandable/collapsible sections
    - `AgentReasoningTimeline`: Shows a timeline of agent activities and transitions
    - `AgentCard`: Displays individual agent information, including messages, tools used, and source documents
    - Supports multi-agent reasoning with agent transitions and specialized agent roles

4. **Core Chat Components**
    - `Sidebar`: Compact sidebar navigation (48px width) with smaller icons
    - `WelcomeScreen`: Welcome screen with centered content and prompt suggestions
    - `ChatInput`: Compact input field with file upload and voice recording capabilities
    - `ChatHeader`: Minimal header with title and action buttons

## Demo Mode

A demo mode is included that uses mock data to showcase the UI without requiring a backend connection. To use the demo:

1. Navigate to `/chat-demo` to see the demo landing page
2. Click "Start Demo Chat" to begin a new chat session
3. Try the following queries:
    - Ask about "opportunities by company size" to see the table view
    - Include the word "error" in your message to see error handling
    - Ask about "agent reasoning" to see the agent reasoning feature
    - Any other message will show a standard response

## Implementation Details

### Message Types

1. **User Messages**

    - Small avatar (32px) with rounded corners (8px) on the left
    - Message content in a gradient bubble with rounded corners
    - Right-aligned timestamp

2. **Assistant Messages**

    - Small avatar (32px) with rounded corners (8px) on the right
    - Message content in a white bubble with rounded corners
    - Left-aligned timestamp

3. **Result Messages**
    - Small avatar (32px) with rounded corners (8px) on the left
    - "Results" header with "Show steps" button
    - Collapsible search status section showing steps like "Searching examples and definitions"
    - Content section with either text or a data table
    - For tables: proper column headers, aligned data, and "Preview is limited to X records" indicator

### Components

-   `MessageBubble`: Renders different message types with appropriate styling
-   `ResultHeader`: Shows title and "Show steps" button
-   `SearchStatus`: Displays search steps with appropriate icons
-   `ResultTable`: Renders tabular data with proper formatting
-   `ChatInput`: Handles user input with file upload and voice recording
-   `Sidebar`: Provides navigation and session management
-   `WelcomeScreen`: Shows initial screen with prompt suggestions

### Hooks

-   `useChat`: Manages chat state and interactions with backend
-   `useMockChat`: Mock implementation for testing UI without backend
-   `useStreamingRender`: Handles streaming text rendering
-   `useAgentReasoning`: Manages agent reasoning data

## Usage

To use the chat UI in your application:

```jsx
import Chat from './views/chat';

// Basic usage
<Chat
  chatflowid="your-chatflow-id"
  title="Chat Title"
/>

// With all options
<Chat
  chatflowid="your-chatflow-id"
  initialMessages={[]}
  title="Chat Title"
  darkMode={false}
  showAgentReasoning={true}
  allowFiles={true}
  allowImages={true}
  allowVoice={true}
  showSettings={true}
  showExport={true}
  showShare={true}
  showClear={true}
  showReset={true}
  customActions={[]}
  onError={(err) => console.error(err)}
  onMessageStart={(message) => console.log('Message started', message)}
  onMessageComplete={(message) => console.log('Message completed', message)}
  onMessageUpdate={(update) => console.log('Message update', update)}
  onStreamStart={() => console.log('Stream started')}
  onStreamEnd={() => console.log('Stream ended')}
/>
```

## Development

To run the demo locally:

1. Start the development server:

    ```
    npm run dev
    ```

2. Navigate to `/chat-demo` in your browser

## Customization

The chat UI can be customized in several ways:

1. **Theme**: Modify `theme.js` to change colors, typography, and other visual aspects
2. **Components**: Each component can be customized or replaced as needed
3. **Mock Data**: Update `useMockChat.js` to change the mock responses
