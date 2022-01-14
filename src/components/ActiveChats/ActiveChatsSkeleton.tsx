import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function ActiveChatsSkeleton() {
    function ChatCardSkeleton() {
        return (
            <div className="active-chat-card">
                <Skeleton style={{ width: 150, height: 30 }}/>
                <div className="active-chat-right">
                    <Skeleton width={75}/>
                    <Skeleton width={100} height={30} style={{ borderRadius: 'var(--msg-right-border-radius)' }}/>
                </div>
            </div>
        )
    }

    return (
        <div className="active-chats-container">
            <h1>Your active chats</h1>
            <div className="active-chat-cards-container">
                <SkeletonTheme baseColor="#282d42" highlightColor="#464f74" >
                    <div className="active-chats-account-info">
                        <div>
                            <Skeleton width={125}/>
                            <Skeleton width={180} height={50} style={{ marginTop: 5 }}/>
                        </div>
                        <Skeleton width={80} height={40} style={{ marginRight: 10 }}/>
                    </div>
                    {Array(5).fill(null).map(() => <ChatCardSkeleton/>)}
                </SkeletonTheme>
            </div>
        </div>
    )
}