import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FbCreateResponse, Post } from "src/app/shared/interfaces";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class PostsService {
    constructor(private http: HttpClient){}

    create(post: Post): Observable<Post> {
        return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
            .pipe(map((res:FbCreateResponse) => {
                const newPost: Post = {
                    ...post,
                    id: res.name,
                    date: new Date(post.date)
                }
                return newPost;
            }))
    }
}