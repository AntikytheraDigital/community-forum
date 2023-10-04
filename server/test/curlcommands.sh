
# testing create new post 
curl -X POST http://localhost:3000/board/createPost -H "Content-Type: application/json" -d '{
"boardID": "testBoard23",
"authorID": "testauthorhelloo",
"content": "contentTest 123",
"timestamp": "1696382112630",
"title": "titleTest 123"
}'

#delete post
#note: should change out the number at the end of the url to the postID you want to delete
curl -X DELETE http://localhost:3000/board/deletepost/651cb72221a2f6befb5bba7e


