import { formatDistanceToNow } from "date-fns";

export const FormatDateDistance = (date)=>{

    const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true
    });

    return timeAgo
}