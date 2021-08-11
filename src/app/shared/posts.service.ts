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
        return this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
            .pipe(map((res:FbCreateResponse) => {
                const newPost: Post = {
                    ...post,
                    id: res.name,
                    date: new Date(post.date)
                }
                return newPost;
            }))
    }

    getAll(): Observable<Post[]> {
        return this.http.get(`${environment.fbDbUrl}/posts.json`)
            .pipe(map((res: {[key: string]: any}) => {
                return Object
                    .keys(res)
                    .map(key => ({
                        ...res[key],
                        id: key,
                        date: new Date(res[key].date)
                    }))
            }))
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
    }
}