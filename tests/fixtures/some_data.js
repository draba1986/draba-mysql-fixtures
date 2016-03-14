module.exports = {
    user:{
        user1:{id:1, username:'admin'},
        user2:{id:2, username:'guest'}
    },
    article:{
        article1:{id:100, user_id:1, title:'标题1', content:'<br>正文内容1', created:'2016-03-12 12:12:12'},
        article2:{id:101, user_id:1, title:'标题2', content:'<br>正文内容2', created:'2016-03-12 12:12:13'},
        article3:{id:102, user_id:3, title:'标题3', content:'<br>正文内容3', created:'2016-03-12 12:12:14'}
    },
    comment:{
        comment1:{id:10000, article_id:100, content:'<div>评论内容1</div>', created:'2016-03-12 12:11:12'},
        comment2:{id:10001, article_id:100, content:'<div>评论内容2</div>', created:'2016-03-12 12:12:12'},
        comment3:{id:10002, article_id:101, content:'<div>评论内容3</div>', created:'2016-03-12 12:13:12'}
    }
};