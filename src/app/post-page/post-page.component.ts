import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../shared/interfaces';
import { PostsService } from '../shared/posts.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  id!:string
  post$!: Observable<Post>

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe((params: Params) => {
        this.id = params.id
        this.postsService.getById(this.id)
      })

    this.post$ = this.postsService.getPosts$()
      .pipe(
        map((posts: Post[]) => {
          return posts.find(post => post.id === this.id)!
        })
      )
  }

  private handleError(error: HttpErrorResponse){
    const {message}=error.error.error

    console.log(message);

    return throwError(message)
}

}
