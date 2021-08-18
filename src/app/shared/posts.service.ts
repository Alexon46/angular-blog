import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { FbCreateResponse, Post } from "src/app/shared/interfaces";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class PostsService {

    private _posts$:BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([])
    private postsStore: Post[] = []

    constructor(private http: HttpClient){}

    getPosts$() {
        return this._posts$;
    }

    create(post: Post, callback?: Function) {
        this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
            .pipe(map((res:FbCreateResponse) => {
                const newPost: Post = {
                    ...post,
                    id: res.name,
                    date: new Date(post.date)
                }
                return newPost;
            }))
            .subscribe((post: Post) => {
                this.postsStore.push(post);
                this._posts$.next(this.postsStore)
                if(callback){
                    callback()
                }
            })
    }

    getAll() {
        this.http.get(`${environment.fbDbUrl}/posts.json`)
            .pipe(map((res: {[key: string]: any}) => {

                if(!res) return [];

                return Object
                    .keys(res)
                    .map(key => ({
                        ...res[key],
                        id: key,
                        date: new Date(res[key].date)
                    }))
            }))
            .subscribe((posts) => {
                this.postsStore = posts;
                this._posts$.next(this.postsStore)
            })
    }

    getById(id:string, callback?: Function){
        this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
            .pipe(map((post: Post) => {
                return {
                    ...post, 
                    id,
                    date: new Date(post.date)
                };
            }))
            .subscribe((post: Post) => {

                let isFoundInStore = false;

                this.postsStore.forEach((p, i) => {
                    if(p.id === id) {
                        this.postsStore[i] = post
                        isFoundInStore = true;
                    }
                })

                if (!isFoundInStore) {
                    this.postsStore.push(post)
                }

                if(callback){
                    callback(post)
                }

                this._posts$.next(this.postsStore)
            })
    }

    update(post: Post, callback?: Function) {

        this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post).subscribe(() => {
            this.postsStore.forEach((p, i) => {
                if (p.id === post.id) { 
                    this.postsStore[i] = post; 
                }
            });
            this._posts$.next(this.postsStore)
            if(callback){
                callback()
            }
        })
    }

    remove(id: string) {
        this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`).subscribe(() => {
            this.postsStore = this.postsStore.filter((p, i) => {
                return p.id !== id
            });
            this._posts$.next(this.postsStore)
        })
    }
}