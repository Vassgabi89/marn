import { Component, OnInit } from "@angular/core";
import { AuthenticationsService } from "src/app/services/authentications.service";
import { User } from "src/app/model/user";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public user: User = new User();
  public error: any = "";

  constructor(
    private authService: AuthenticationsService,
    private router: Router
  ) {}

  ngOnInit() {}

  public onSubmit(): void {
    this.authService
      .login(this.user.username, this.user.password)
      .toPromise()
      .then(
        (data) => {
          this.router.navigateByUrl("/");
        },
        (err) => {
          this.error = err;
        }
      );
  }
}
