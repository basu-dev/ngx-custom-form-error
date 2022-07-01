# NgxCustomFormError

NgxCustomFormError helps you display form errors in easiest and most consistent way possible.

## How To Implement

The discussion below has following points.

1. Setup
2. Prividing each error messages manually.
3. Using global config for error messages.
4. Improving the Global Config for specific field inputs.
5. Providing Label to the config from template
6. Extra Feature for Max Input Length
7. Handling different scenarios

Install the pacakge and add it in the module you want to use.

```bash
npm i ngx-custom-form-error
```

```ts
@NgModule({
    ...
    imports:[
        ...,
        NgxCustomFormError
    ]
})
```

```ts
this.form = this.fb.group({
  foodName: ["", [Validators.required, Validators.maxLength(25)]],
  maxRating: [, [Validators.required, Validators.max(5)]],
});
```

We will use the form shown above and discuss various ways of showing errors.

### Different ways of showing error messages

> You need to wrap your element that has `formControlName` inside `c-form-error` element.

1. Prividing each error messages manually

```html
<form [formGroup]="form" class="form-group">
  <div class="form-field">
    <c-form-error
      required="Food Name is required"
      maxLength="Food Name cannot exceed 25 characters."
    >
      <label class="required">Food Name</label>
      <input class="form-control" formControlName="foodName" />
    </c-form-error>
  </div>

  <div class="form-field">
    <c-form-error
      required="Star Rating is required"
      max="Star Rating cannot be greater than 5"
    >
      <label class="required">Star Rating</label>
      <input type="number" class="form-control" formControlName="starRating" />
    </c-form-error>
  </div>
</form>
```

2. Using global config for error messages.
   For this you have to provide a config of error messages while adding `NgxCustomFormError` in the imports array

```ts
@NgModule({
    imports:[
    NgxCustomFormErrorModule
      .rootConfig(<IErrorConfig>{
        onTouchedOnly: true,
        required: 'The field is required',
        maxLength:'Input is too long',
        max:'Value too large',
      })
    ]
})
```

In the above config, wee see the default messages (which are obviously not good since these are too generic.) for `required` , `maxLength` and `max` error case.
In addition to that, `onTouchedOnly` is set to true, so that error only shows up once the input is touched.

In this case you don't need to pass any input to the `c-form-error` element. The error message shows up from the config.

```html
<form [formGroup]="form" class="form-group">
  <div class="form-field">
    <c-form-error>
      <label class="required">Food Name</label>
      <input class="form-control" formControlName="foodName" />
    </c-form-error>
  </div>

  <div class="form-field">
    <c-form-error>
      <label class="required">Star Rating</label>
      <input type="number" class="form-control" formControlName="starRating" />
    </c-form-error>
  </div>
</form>
```

### Improving the Global Config for specific field inputs

As mentioned above, the error message `It is required` is obviously no enough. We want the message to be like `Food Name is required` and instead of `Input too long` we want `Food Name cannot exceed 25 characters`.

So lets update our config file to accomodate that feature.

```ts
@NgModule({
    imports:[
 NgxCustomFormErrorModule
      .rootConfig(<IErrorConfig>{
        onTouchedOnly: true,
        required: (label: string) => `${label} is required`,
        maxLength: (label: string, data: { requiredLength: number; }) =>
          `${label ?? 'It'} cannot exceed ${data.requiredLength} characters.`,
        max: (label: string, data: { max: number; }) =>
          `${label ?? 'It'} cannot be greater than ${data.max}.`
      }),
    ]
})
```

The error message in the config can either be string or function that takes two arguments (label and data).

> I will provide a config with all the properties at the end of this page. You can customize the config as your wish and paste that in your global config.

As we can see from the config, we somehow need to pass value to the `label` that is being used in the config function whereas the data property is passed by the Angular Form itself when error occurs.

#### Providing Label to the config from template

```html
<form [formGroup]="form" class="form-group">
  <div class="form-field">
    <c-form-error>
      <label cLabel class="required">Food Name</label>
      <input class="form-control" formControlName="foodName" />
    </c-form-error>
  </div>

  <div class="form-field">
    <c-form-error>
      <label cLabel class="required">Star Rating</label>
      <input type="number" class="form-control" formControlName="starRating" />
    </c-form-error>
  </div>
</form>
```

You can see the `cLabel` directive is added to `<label>` tag.
What we do is use the `innerText` of the element that has `cLabel` directive as label for the error message.

Now the error message looks just like we expected. eg. `Food Name is required`.

If you do not have `<label>` tag in your form you can pass `label` input to the
`<c-form-control>` element.

```html
<c-form-error label="Food Name">
  <input class="form-control" formControlName="foodName" />
</c-form-error>
```

### Extra Feature for Max Input Length

img
