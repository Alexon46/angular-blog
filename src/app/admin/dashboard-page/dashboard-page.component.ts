import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { first, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  posts$!: Observable<Post[]>
  search: FormControl = new FormControl(null, [])

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.combineStream()
  }

  combineStream() {
    return combineLatest(
      this.search.valueChanges.pipe(startWith('')),
      this.postsService.getAll()
    ).pipe(
      map(this.filter)
    )
  }

  filter([searchStr, allPosts]: [string, Post[]]) {
    if(!searchStr.trim()) {
      return allPosts
    }
    return allPosts.filter((post: Post) => {
      return post.title.toLowerCase().includes(searchStr.toLowerCase())
    })
  }

  remove(id:string|undefined) {
    this.posts$ = this.postsService.remove(id!)
      .pipe(
        first(),
        switchMap(() => {
          return this.combineStream()
        })
      )
  }

}
