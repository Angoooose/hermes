import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// This will be improved much more later, just needed to push to switch computers.

export default function ActiveChatsSkeleton() {
    return (
        <div className="active-chats-container">
            <h1>Your active chats</h1>
            <div className="active-chat-cards-container">
                <SkeletonTheme baseColor="#282d42" highlightColor="#464f74" >
                    <div className="active-chats-account-info">
                        <div>
                            <Skeleton style={{ width: 125}}/>
                            <Skeleton style={{ width: 180, height: 50, marginTop: 5}}/>
                        </div>
                        <Skeleton style={{ width: 80, height: 40, marginRight: 10 }}/>
                    </div>
                    <div className="active-chat-card">
                        <Skeleton style={{ width: 150, height: 30 }}/>
                        <div className="active-chat-right">
                            <Skeleton style={{ width: 50 }}/>
                            <Skeleton style={{ width: 100, height: 30, borderRadius: '12px 12px 0 12px' }}/>
                        </div>
                    </div>
                    <div className="active-chat-card">
                        <Skeleton style={{ width: 150, height: 30 }}/>
                        <div className="active-chat-right">
                            <Skeleton style={{ width: 50 }}/>
                            <Skeleton style={{ width: 100, height: 30, borderRadius: '12px 12px 0 12px' }}/>
                        </div>
                    </div>
                    <div className="active-chat-card">
                        <Skeleton style={{ width: 150, height: 30 }}/>
                        <div className="active-chat-right">
                            <Skeleton style={{ width: 50 }}/>
                            <Skeleton style={{ width: 100, height: 30, borderRadius: '12px 12px 0 12px' }}/>
                        </div>
                    </div>
                    <div className="active-chat-card">
                        <Skeleton style={{ width: 150, height: 30 }}/>
                        <div className="active-chat-right">
                            <Skeleton style={{ width: 50 }}/>
                            <Skeleton style={{ width: 100, height: 30, borderRadius: '12px 12px 0 12px' }}/>
                        </div>
                    </div>
                    <div className="active-chat-card">
                        <Skeleton style={{ width: 150, height: 30 }}/>
                        <div className="active-chat-right">
                            <Skeleton style={{ width: 50 }}/>
                            <Skeleton style={{ width: 100, height: 30, borderRadius: '12px 12px 0 12px' }}/>
                        </div>
                    </div>
                </SkeletonTheme>
            </div>
        </div>
    )
}