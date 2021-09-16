<form id="form-id">
	<div>
		<label>Text Input</label>
		<input name="input" type="text">
	</div>
  <div>
		<label>Text Input to Ignore</label>
		<input data-form-no-save name="input-ignore" type="text">
	</div>
	<div>
		<label>
			<input type="checkbox" name="checkbox1" value="1" class="form-control">
			Checkbox 1
		</label>
	</div>
	<div>
		<label>
		<input type="checkbox" name="checkbox2" value="2" class="form-control">
			Checkbox 2
		</label>
	</div>
	<div>
		<label>
		<input type="radio" name="radioset" value="radio1" class="form-control">
			Radio 1
		</label>
	</div>
	<div>
		<label>
		<input type="radio" name="radioset" value="radio2" class="form-control">
			Radio 2
		</label>
	</div>
	<div>
		<select name="select" class="form-control">
			<option>Select 1</option>
			<option>Select 2</option>
			<option>Select 3</option>
		</select>
	</div>
	<div>
		<textarea name="textarea" class="form-control"></textarea>
	</div>
	<div class="form-saver">
		<div data-form-status></div>
		<div>
			<button data-form-save="#form-id">
				Save Form Data
			</button>
			<button data-form-delete="#form-id">
				Delete Form Data
			</button>
		</div>
	</div>
</form>
