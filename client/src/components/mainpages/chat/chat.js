import React, { useState } from 'react'

import { ChatEngine, getOrCreateChat } from 'react-chat-engine'
import './chat.css'
export const DirectChatPage = () => {
    const [username, setUsername] = useState('')
    const user = JSON.parse(localStorage.getItem('firstLogin'))
    function createDirectChat(creds) {
        getOrCreateChat(
            creds,
            { is_direct_chat: true, usernames: [username] },
            () => setUsername('')
        )
    }

    function renderChatForm(creds) {
        return (
            <div>
                <input
                    placeholder='Nom Utilisateur'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    className='inputchat'
                />
                <button className="btnchat" onClick={() => createDirectChat(creds)}>
                Créer disc
                </button>
            </div>
        )
    }

    return (
        <ChatEngine
            height='100vh'
            userName={user?.user?.username}
            userSecret={user?.user?.secret}
            projectID='d31d4c7b-54b1-44a8-a699-8c3c59b7538f'
            renderNewChatForm={(creds) => renderChatForm(creds)}
        />
    )
}

