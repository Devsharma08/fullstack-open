const Notification = ({message, styles}) => {
    if (!message) {
        return null;
    }

    return (
        <div style={styles}>{message}</div>
    )
}

export default Notification;