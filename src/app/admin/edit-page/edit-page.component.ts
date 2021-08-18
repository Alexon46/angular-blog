import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  id!:string
  form!: FormGroup
  post$!: Observable<Post>
  post!: Post
  submited: boolean = false

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id
      this.postsService.getById(this.id, (p: Post) => {
        this.form = new FormGroup({
          title: new FormControl(p.title, Validators.required),
          text: new FormControl(p.text, Validators.required),
        })
        this.post = p;
      })
    })
    this.post$ = this.postsService.getPosts$().pipe(
      map((posts: Post[]) => {
        return posts.find(post => post.id === this.id)!
      })
    )
  }

  submit(){
    if(this.form.invalid) {
      return
    }

    this.submited = true

    this.postsService
      .update({
        ...this.post,
        text: this.form.value.text,
        title: this.form.value.title,
      }, () => {
        this.submited = false
      })
  }

}
