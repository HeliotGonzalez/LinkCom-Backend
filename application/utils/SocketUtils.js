export const socketEventMap = {
    INSERT: (socket) => socket.onInsert(),
    UPDATE: (socket) => socket.onUpdate(),
    DELETE: (socket) => socket.onDelete()
}