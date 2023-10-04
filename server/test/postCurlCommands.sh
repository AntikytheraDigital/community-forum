#edit post 
curl -X PATCH http://localhost:3000/post/edit/651cbcff21a2f6befb5bba82  -H "Content-Type: application/json" -d '{
    "content": "Your updated content here",
    "title": "Your updated title here"
}'

#add comment 
curl -X POST http://localhost:3000/post/addComment  -H "Content-Type: application/json" -d '{
    "postID": "123", 
    "authorID": "32134",
    "content": "Your comment here",
    "timestamp": "1696395392366"
}'

#edit comment 
curl -X PATCH http://localhost:3000/post/editComment/651cf108172b6f62bb8ddbde  -H "Content-Type: application/json" -d '{
    "content": "Your updated content here"
}'

#delete comment 
curl -X DELETE http://localhost:3000/post/deleteComment/651cf108172b6f62bb8ddbde

#get post
curl -X GET http://localhost:3000/post/getPost/651cbcff21a2f6befb5bba82