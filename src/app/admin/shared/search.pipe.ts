import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "src/app/shared/interfaces";

@Pipe({
    name: 'searchPosts'
})
export class SearchPipe implements PipeTransform {
    transform(
        posts: any, 
        search: string
    ): Post[] {
        if (!search.trim()) {
            return posts
        }

        return posts.filter((post: Post) => {
            return post.title.toLowerCase().includes(search.toLowerCase())
        })
    }
}