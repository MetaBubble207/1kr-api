import { RouteOption, TagOption } from '../restful/types';

import { CommentController } from './comment.controller';

export const createCommentApi = () => {
    const routes: Record<'app', RouteOption[]> = {
        app: [
            {
                name: 'app.comment',
                path: '',
                controllers: [CommentController],
            },
        ],
    };
    const tags: Record<'app', (string | TagOption)[]> = {
        app: [{ name: '评论', description: '评论相关接口' }],
    };
    return { routes, tags };
};
