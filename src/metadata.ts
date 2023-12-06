/* eslint-disable */
export default async () => {
    const t = {
        ["./modules/content/entities/comment.entity"]: await import("./modules/content/entities/comment.entity"),
        ["./modules/content/entities/post.entity"]: await import("./modules/content/entities/post.entity"),
        ["./modules/content/constants"]: await import("./modules/content/constants"),
        ["./modules/content/entities/category.entity"]: await import("./modules/content/entities/category.entity"),
        ["./modules/content/entities/tag.entity"]: await import("./modules/content/entities/tag.entity"),
        ["./modules/user/entities/access-token.entity"]: await import("./modules/user/entities/access-token.entity"),
        ["./modules/user/entities/refresh-token.entity"]: await import("./modules/user/entities/refresh-token.entity"),
        ["./modules/user/entities/user.entity"]: await import("./modules/user/entities/user.entity"),
        ["./modules/database/constants"]: await import("./modules/database/constants"),
        ["./modules/circle/entities/circle.entity"]: await import("./modules/circle/entities/circle.entity"),
        ["./modules/circle/entities/tag.entity"]: await import("./modules/circle/entities/tag.entity"),
        ["./modules/circle/entities/fee.entity"]: await import("./modules/circle/entities/fee.entity"),
        ["./modules/user/constants"]: await import("./modules/user/constants")
    };
    return { "@nestjs/swagger": { "models": [[import("./modules/content/entities/comment.entity"), { "CommentEntity": { id: { required: true, type: () => String }, body: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, depth: { required: true, type: () => Object, default: 0 }, parent: { required: true, type: () => t["./modules/content/entities/comment.entity"].CommentEntity, nullable: true }, children: { required: true, type: () => [t["./modules/content/entities/comment.entity"].CommentEntity] }, post: { required: true, type: () => t["./modules/content/entities/post.entity"].PostEntity } } }], [import("./modules/content/entities/tag.entity"), { "TagEntity": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: false, type: () => String }, deletedAt: { required: true, type: () => Date }, postCount: { required: true, type: () => Number, description: "\u901A\u8FC7queryBuilder\u751F\u6210\u7684\u6587\u7AE0\u6570\u91CF(\u865A\u62DF\u5B57\u6BB5)" }, posts: { required: true, type: () => [t["./modules/content/entities/post.entity"].PostEntity] } } }], [import("./modules/content/entities/post.entity"), { "PostEntity": { id: { required: true, type: () => String }, title: { required: true, type: () => String }, body: { required: true, type: () => String }, summary: { required: false, type: () => String }, keywords: { required: false, type: () => [String] }, type: { required: true, enum: t["./modules/content/constants"].PostBodyType }, publishedAt: { required: false, type: () => Date, nullable: true }, customOrder: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, commentCount: { required: true, type: () => Number, description: "\u901A\u8FC7queryBuilder\u751F\u6210\u7684\u8BC4\u8BBA\u6570\u91CF(\u865A\u62DF\u5B57\u6BB5)" }, category: { required: true, type: () => t["./modules/content/entities/category.entity"].CategoryEntity }, tags: { required: true, type: () => [t["./modules/content/entities/tag.entity"].TagEntity] }, comments: { required: true, type: () => [t["./modules/content/entities/comment.entity"].CommentEntity] } } }], [import("./modules/content/entities/category.entity"), { "CategoryEntity": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, customOrder: { required: true, type: () => Number }, deletedAt: { required: true, type: () => Date }, depth: { required: true, type: () => Object, default: 0 }, parent: { required: true, type: () => t["./modules/content/entities/category.entity"].CategoryEntity, nullable: true }, children: { required: true, type: () => [t["./modules/content/entities/category.entity"].CategoryEntity] }, posts: { required: true, type: () => [t["./modules/content/entities/post.entity"].PostEntity] } } }], [import("./modules/user/entities/refresh-token.entity"), { "RefreshTokenEntity": { accessToken: { required: true, type: () => t["./modules/user/entities/access-token.entity"].AccessTokenEntity, description: "\u5173\u8054\u7684\u767B\u5F55\u4EE4\u724C" } } }], [import("./modules/user/entities/user.entity"), { "UserEntity": { id: { required: true, type: () => String }, nickname: { required: false, type: () => String }, username: { required: true, type: () => String }, password: { required: true, type: () => String }, phone: { required: false, type: () => String }, email: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, accessTokens: { required: true, type: () => [t["./modules/user/entities/access-token.entity"].AccessTokenEntity] }, deletedAt: { required: true, type: () => Date } } }], [import("./modules/user/entities/access-token.entity"), { "AccessTokenEntity": { refreshToken: { required: true, type: () => t["./modules/user/entities/refresh-token.entity"].RefreshTokenEntity }, user: { required: true, type: () => t["./modules/user/entities/user.entity"].UserEntity } } }], [import("./modules/restful/dtos/delete.dto"), { "DeleteDto": { ids: { required: true, type: () => [String], description: "\u5F85\u5220\u9664\u6570\u636E\u7684ID\u5217\u8868" } } }], [import("./modules/restful/dtos/delete-with-trash.dto"), { "DeleteWithTrashDto": { trash: { required: false, type: () => Boolean, description: "\u662F\u5426\u8F6F\u5220\u9664" } }, "RestoreDto": { ids: { required: true, type: () => [String], description: "\u5F85\u6062\u590D\u6570\u636E\u7684ID\u5217\u8868" } } }], [import("./modules/restful/dtos/paginate.dto"), { "PaginateDto": { page: { required: false, type: () => Number, description: "\u5F53\u524D\u9875", default: 1, minimum: 1 }, limit: { required: false, type: () => Number, description: "\u6BCF\u9875\u6570\u636E\u91CF", default: 10, minimum: 1 } } }], [import("./modules/restful/dtos/paginate-width-trashed.dto"), { "PaginateWithTrashedDto": { trashed: { required: false, description: "\u6839\u636E\u8F6F\u5220\u9664\u72B6\u6001\u67E5\u8BE2", enum: t["./modules/database/constants"].SelectTrashMode } } }], [import("./modules/content/dtos/category.dto"), { "QueryCategoryTreeDto": { trashed: { required: false, description: "\u6839\u636E\u8F6F\u5220\u9664\u72B6\u6001\u67E5\u8BE2", enum: t["./modules/database/constants"].SelectTrashMode } }, "CreateCategoryDto": { name: { required: true, type: () => String, description: "\u5206\u7C7B\u540D", maxLength: 25 }, parent: { required: false, type: () => String, description: "\u7236\u5206\u7C7BID" }, customOrder: { required: false, type: () => Number, description: "\u81EA\u5B9A\u4E49\u6392\u5E8F", default: 0, minimum: 0 } }, "UpdateCategoryDto": { id: { required: true, type: () => String, description: "\u5F85\u66F4\u65B0ID" } } }], [import("./modules/content/dtos/post.dto"), { "QueryPostDto": { search: { required: false, type: () => String, description: "\u5168\u6587\u641C\u7D22", maxLength: 100 }, isPublished: { required: false, type: () => Boolean, description: "\u662F\u5426\u67E5\u8BE2\u5DF2\u53D1\u5E03(\u5168\u90E8\u6587\u7AE0:\u4E0D\u586B\u3001\u53EA\u67E5\u8BE2\u5DF2\u53D1\u5E03\u7684:true\u3001\u53EA\u67E5\u8BE2\u672A\u53D1\u5E03\u7684:false)" }, orderBy: { required: false, description: "\u67E5\u8BE2\u7ED3\u679C\u6392\u5E8F,\u4E0D\u586B\u5219\u7EFC\u5408\u6392\u5E8F", enum: t["./modules/content/constants"].PostOrderType }, category: { required: false, type: () => String, description: "\u6839\u636E\u5206\u7C7BID\u67E5\u8BE2\u6B64\u5206\u7C7B\u53CA\u5176\u540E\u4EE3\u5206\u7C7B\u4E0B\u7684\u6587\u7AE0" }, tag: { required: false, type: () => String, description: "\u6839\u636E\u7BA1\u7406\u6807\u7B7EID\u67E5\u8BE2" } }, "CreatePostDto": { title: { required: true, type: () => String, description: "\u6587\u7AE0\u6807\u9898", maxLength: 255 }, body: { required: true, type: () => String, description: "\u6587\u7AE0\u5185\u5BB9" }, summary: { required: false, type: () => String, description: "\u6587\u7AE0\u63CF\u8FF0", maxLength: 500 }, publishedAt: { required: false, type: () => Date, description: "\u662F\u5426\u53D1\u5E03(\u53D1\u5E03\u65F6\u95F4)" }, keywords: { required: false, type: () => [String], description: "SEO\u5173\u952E\u5B57", maxLength: 20 }, customOrder: { required: true, type: () => Object, description: "\u81EA\u5B9A\u4E49\u6392\u5E8F", default: 0, minimum: 0 }, category: { required: true, type: () => String, description: "\u6240\u5C5E\u5206\u7C7BID" }, tags: { required: false, type: () => [String], description: "\u5173\u8054\u6807\u7B7EID" } }, "UpdatePostDto": { id: { required: true, type: () => String, description: "\u5F85\u66F4\u65B0ID" } } }], [import("./modules/content/dtos/comment.dto"), { "QueryCommentDto": { post: { required: false, type: () => String, description: "\u6240\u5C5E\u6587\u7AE0ID" } }, "QueryCommentTreeDto": {}, "CreateCommentDto": { body: { required: true, type: () => String, description: "\u8BC4\u8BBA\u5185\u5BB9", maxLength: 1000 }, post: { required: true, type: () => String, description: "\u6240\u5C5E\u6587\u7AE0ID" }, parent: { required: false, type: () => String, description: "\u4E0A\u7EA7\u8BC4\u8BBAID" } } }], [import("./modules/content/dtos/tag.dto"), { "CreateTagDto": { name: { required: true, type: () => String, description: "\u6807\u7B7E\u540D\u79F0", maxLength: 255 }, description: { required: false, type: () => String, description: "\u6807\u7B7E\u63CF\u8FF0", maxLength: 500 } }, "UpdateTagDto": { id: { required: true, type: () => String, description: "\u5F85\u66F4\u65B0ID" } } }], [import("./modules/core/common/base.entity"), { "BaseEntity": { id: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } }, "BaseWithUpdatedEntity": { updatedAt: { required: true, type: () => Date } }, "BaseWithDeletedEntity": { deletedAt: { required: true, type: () => Date } } }], [import("./modules/circle/entities/fee.entity"), { "SocialCircleFeeEntity": { circle: { required: true, type: () => t["./modules/circle/entities/circle.entity"].SocialCircleEntity }, type: { required: true, type: () => Number }, amount: { required: true, type: () => Number } } }], [import("./modules/circle/entities/tag.entity"), { "TagEntity": { name: { required: true, type: () => String }, circles: { required: true, type: () => [t["./modules/circle/entities/tag.entity"].SocialCircleTagEntity] } }, "SocialCircleTagEntity": { tag: { required: true, type: () => t["./modules/circle/entities/tag.entity"].TagEntity }, circle: { required: true, type: () => t["./modules/circle/entities/circle.entity"].SocialCircleEntity } } }], [import("./modules/circle/entities/circle.entity"), { "SocialCircleEntity": { user: { required: true, type: () => t["./modules/user/entities/user.entity"].UserEntity }, free: { required: true, type: () => Boolean }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, cover: { required: true, type: () => String }, bgImage: { required: true, type: () => String }, memberCount: { required: true, type: () => Number }, followerCount: { required: true, type: () => Number }, members: { required: true, type: () => [t["./modules/circle/entities/circle.entity"].SocialCircleUserEntity] }, tags: { required: true, type: () => [t["./modules/circle/entities/tag.entity"].SocialCircleTagEntity] }, fees: { required: true, type: () => [t["./modules/circle/entities/fee.entity"].SocialCircleFeeEntity] }, coverUrl: { required: true, type: () => String }, bgImageUrl: { required: true, type: () => String } }, "SocialCircleUserEntity": { user: { required: true, type: () => t["./modules/user/entities/user.entity"].UserEntity }, circle: { required: true, type: () => t["./modules/circle/entities/circle.entity"].SocialCircleEntity }, expiredTime: { required: true, type: () => Number } } }], [import("./modules/circle/entities/follow.entity"), { "SocialCircleFollowerEntity": { user: { required: true, type: () => t["./modules/user/entities/user.entity"].UserEntity }, circle: { required: true, type: () => t["./modules/circle/entities/circle.entity"].SocialCircleEntity } } }], [import("./modules/circle/dtos/circle.dto"), { "CreateCircleDto": { name: { required: true, type: () => String, description: "\u540D\u79F0", maxLength: 15 }, description: { required: true, type: () => String, description: "\u63CF\u8FF0" }, cover: { required: false, type: () => String, description: "\u5C01\u9762" }, bgImage: { required: false, type: () => String, description: "\u80CC\u666F\u56FE\u7247" }, tags: { required: false, type: () => [String], description: "\u5173\u8054\u6807\u7B7EID" } }, "UpdateCircleDto": {}, "JoinCircleDto": { id: { required: true, type: () => String } }, "ExitCircleDto": {}, "FollowCircleDto": {}, "UnFollowCircleDto": {} }], [import("./modules/user/dtos/common.dto"), { "UserCommonDto": { credential: { required: true, type: () => String, description: "\u767B\u5F55\u51ED\u8BC1:\u53EF\u4EE5\u662F\u7528\u6237\u540D,\u624B\u673A\u53F7,\u90AE\u7BB1\u5730\u5740", minLength: 4, maxLength: 30 }, username: { required: true, type: () => String, description: "\u7528\u6237\u540D", minLength: 4, maxLength: 30 }, nickname: { required: false, type: () => String, description: "\u6635\u79F0:\u4E0D\u8BBE\u7F6E\u5219\u4E3A\u7528\u6237\u540D", minLength: 3, maxLength: 20 }, phone: { required: true, type: () => String, description: "\u624B\u673A\u53F7:\u5FC5\u987B\u662F\u533A\u57DF\u5F00\u5934\u7684,\u6BD4\u5982+86.15005255555" }, email: { required: true, type: () => String, description: "\u90AE\u7BB1\u5730\u5740:\u5FC5\u987B\u7B26\u5408\u90AE\u7BB1\u5730\u5740\u89C4\u5219" }, password: { required: true, type: () => String, description: "\u7528\u6237\u5BC6\u7801:\u5BC6\u7801\u5FC5\u987B\u7531\u5C0F\u5199\u5B57\u6BCD,\u5927\u5199\u5B57\u6BCD,\u6570\u5B57\u4EE5\u53CA\u7279\u6B8A\u5B57\u7B26\u7EC4\u6210", minLength: 8, maxLength: 50 }, plainPassword: { required: true, type: () => String, description: "\u786E\u8BA4\u5BC6\u7801:\u5FC5\u987B\u4E0E\u7528\u6237\u5BC6\u7801\u8F93\u5165\u76F8\u540C\u7684\u5B57\u7B26\u4E32" } } }], [import("./modules/user/dtos/user.dto"), { "CreateUserDto": {}, "UpdateUserDto": { id: { required: true, type: () => String, description: "\u5F85\u66F4\u65B0\u7684\u7528\u6237ID" } }, "QueryUserDto": { orderBy: { required: false, description: "\u6392\u5E8F\u89C4\u5219:\u53EF\u6307\u5B9A\u7528\u6237\u5217\u8868\u7684\u6392\u5E8F\u89C4\u5219,\u9ED8\u8BA4\u4E3A\u6309\u521B\u5EFA\u65F6\u95F4\u964D\u5E8F\u6392\u5E8F", enum: t["./modules/user/constants"].UserOrderType } } }], [import("./modules/user/dtos/auth.dto"), { "CredentialDto": {}, "UpdatePasswordDto": { oldPassword: { required: true, type: () => String, description: "\u65E7\u5BC6\u7801:\u7528\u6237\u5728\u66F4\u6539\u5BC6\u7801\u65F6\u9700\u8981\u8F93\u5165\u7684\u539F\u5BC6\u7801", minLength: 8, maxLength: 50 } }, "RegisterDto": {} }]], "controllers": [[import("./modules/content/controllers/category.controller"), { "CategoryController": { "tree": { summary: "\u67E5\u8BE2\u5206\u7C7B\u6811", type: [t["./modules/content/entities/category.entity"].CategoryEntity] }, "list": { summary: "\u5206\u9875\u67E5\u8BE2\u5206\u7C7B\u5217\u8868" }, "detail": { summary: "\u5206\u9875\u8BE6\u89E3\u67E5\u8BE2", type: t["./modules/content/entities/category.entity"].CategoryEntity }, "store": { summary: "\u65B0\u589E\u5206\u7C7B", type: t["./modules/content/entities/category.entity"].CategoryEntity }, "update": { summary: "\u66F4\u65B0\u5206\u7C7B", type: t["./modules/content/entities/category.entity"].CategoryEntity }, "delete": { summary: "\u6279\u91CF\u5220\u9664\u5206\u7C7B", type: [t["./modules/content/entities/category.entity"].CategoryEntity] }, "restore": { summary: "\u6279\u91CF\u6062\u590D\u5206\u7C7B", type: [t["./modules/content/entities/category.entity"].CategoryEntity] } } }], [import("./modules/content/controllers/tag.controller"), { "TagController": { "list": { summary: "\u5206\u9875\u67E5\u8BE2\u6807\u7B7E\u5217\u8868" }, "detail": { summary: "\u67E5\u8BE2\u6807\u7B7E\u8BE6\u60C5", type: t["./modules/content/entities/tag.entity"].TagEntity }, "store": { summary: "\u6DFB\u52A0\u65B0\u6807\u7B7E", type: t["./modules/content/entities/tag.entity"].TagEntity }, "update": { summary: "\u66F4\u65B0\u6807\u7B7E", type: t["./modules/content/entities/tag.entity"].TagEntity }, "delete": { summary: "\u6279\u91CF\u5220\u9664\u6807\u7B7E", type: [t["./modules/content/entities/tag.entity"].TagEntity] }, "restore": { summary: "\u6279\u91CF\u6062\u590D\u6807\u7B7E", type: [t["./modules/content/entities/tag.entity"].TagEntity] } } }], [import("./modules/content/controllers/post.controller"), { "PostController": { "list": { summary: "\u5206\u9875\u67E5\u8BE2\u6587\u7AE0\u5217\u8868", type: Object }, "detail": { summary: "\u67E5\u8BE2\u6587\u7AE0\u8BE6\u60C5", type: t["./modules/content/entities/post.entity"].PostEntity }, "store": { summary: "\u65B0\u589E\u6587\u7AE0", type: t["./modules/content/entities/post.entity"].PostEntity }, "update": { summary: "\u67E5\u8BE2\u6587\u7AE0\u8BE6\u60C5", type: t["./modules/content/entities/post.entity"].PostEntity }, "delete": { summary: "\u6279\u91CF\u5220\u9664\u6587\u7AE0", type: [t["./modules/content/entities/post.entity"].PostEntity] }, "restore": { summary: "\u6279\u91CF\u6062\u590D\u6587\u7AE0", type: [t["./modules/content/entities/post.entity"].PostEntity] } } }], [import("./modules/content/controllers/comment.controller"), { "CommentController": { "tree": { summary: "\u67E5\u8BE2\u8BC4\u8BBA\u6811", type: [t["./modules/content/entities/comment.entity"].CommentEntity] }, "list": { summary: "\u5206\u9875\u67E5\u8BE2\u8BC4\u8BBA\u5217\u8868" }, "store": { summary: "\u65B0\u589E\u8BC4\u8BBA", type: t["./modules/content/entities/comment.entity"].CommentEntity }, "delete": { summary: "\u6279\u91CF\u5220\u9664\u8BC4\u8BBA", type: [t["./modules/content/entities/comment.entity"].CommentEntity] } } }], [import("./modules/circle/controllers/circle.controller"), { "CircleController": { "list": {}, "store": { summary: "\u65B0\u589E\u5708\u5B50", type: t["./modules/circle/entities/circle.entity"].SocialCircleEntity }, "join": { summary: "\u52A0\u5165(\u8BA2\u9605)\u514D\u8D39\u5708\u5B50", type: Boolean }, "exit": { summary: "\u9000\u51FA(\u53D6\u6D88\u8BA2\u9605)\u514D\u8D39\u5708\u5B50", type: Boolean }, "follow": { summary: "\u5173\u6CE8\u5708\u5B50", type: Boolean }, "unFollow": { summary: "\u53D6\u5173\u5708\u5B50", type: Boolean }, "detail": { summary: "\u5708\u5B50\u8BE6\u60C5", type: t["./modules/circle/entities/circle.entity"].SocialCircleEntity }, "update": { summary: "\u66F4\u65B0\u5708\u5B50\u4FE1\u606F", type: Boolean } } }], [import("./modules/user/controllers/auth.controller"), { "AuthController": { "login": { summary: "\u7528\u6237\u901A\u8FC7\u51ED\u8BC1(\u53EF\u4EE5\u662F\u7528\u6237\u540D,\u90AE\u7BB1,\u624B\u673A\u53F7\u7B49)+\u5BC6\u7801\u767B\u5F55" }, "logout": { summary: "\u6CE8\u9500\u767B\u5F55" }, "register": { summary: "\u4F7F\u7528\u7528\u6237\u540D\u5BC6\u7801\u6CE8\u518C\u7528\u6237", type: t["./modules/user/entities/user.entity"].UserEntity }, "resetPassword": { summary: "\u7528\u6237\u5BC6\u7801\u66F4\u65B0", type: t["./modules/user/entities/user.entity"].UserEntity } } }], [import("./modules/user/controllers/user.controller"), { "UserController": { "list": { summary: "\u7528\u6237\u5217\u8868", type: [t["./modules/user/entities/user.entity"].UserEntity] }, "detail": { summary: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F", type: t["./modules/user/entities/user.entity"].UserEntity }, "store": { summary: "\u65B0\u589E\u7528\u6237", type: t["./modules/user/entities/user.entity"].UserEntity }, "update": { summary: "\u66F4\u65B0\u7528\u6237\u4FE1\u606F", type: t["./modules/user/entities/user.entity"].UserEntity }, "delete": { summary: "\u6279\u91CF\u5220\u9664\u7528\u6237", type: [t["./modules/user/entities/user.entity"].UserEntity] }, "restore": { summary: "\u6279\u91CF\u6062\u590D\u7528\u6237", type: [t["./modules/user/entities/user.entity"].UserEntity] } } }]] } };
};