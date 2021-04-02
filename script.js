// wait for the page to load
$(document).ready(function () {
  console.log("ready!");

  $(document).tooltip();
  $("#tabs").tabs();
  $("#datepicker").datepicker();

  $($(".sliders")[0]).slider({
    range: "max",
    min: 0,
    max: 10,
    value: 0,
    slide: function (event, ui) {
      $("#amount").val(ui.value);
    }
  });

  let totals = {
    Lab: 0,
    Quiz: 0,
    Exam: 0,
    Project: 0,
    Participation: 0
  };

  let numbers = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten"
  ];

  let generateField = function (isEven) {
    fieldType = "Lab";
    totals[fieldType]++;
    let currentField = totals[fieldType];

    let html = `
    <tr class="${isEven ? "even" : "odd"} row">

    <td >${fieldType} ${numbers[totals[fieldType]]} :
    <input
		type="text"
    title="Please enter your grade here"
    class=${fieldType}
	  />              
     <td style="padding: 12px">
        <div class="sliders"></div>
       </td>

           <td style="padding: 4px">
            Date: <input type="text" class="datePicker" />
       </td>
               
     </tr>
`;
    $(".row").last().after(html);

    $(".sliders").last().slider({
      range: "max",
      min: 0,
      max: 10,
      value: 0
    });

    register(fieldType);
  };

  $("#test").click(function () {
    for (let index = 1; index < 10; index++) {
      generateField(index % 2 == 0);
    }

    $($(".sliders")).each((index, element) => {
      $($(".datePicker")[index]).datepicker();
      $(element).slider({
        slide: function (event, ui) {
          $($(".row .Lab")[index]).val(ui.value);
        }
      });
    });

    console.log("Click");
  });

  $("#addField").click(function () {
    let rowName = fieldType;
    totals[fieldType]++;
    let currentField = totals[fieldType];
    console.log(currentField);

    let html = `<tr class="${
      totals[fieldType] % 2 !== 0 ? "even" : "odd"
    } ${rowName} row"  >
    <td  colspan="2">${fieldType} ${numbers[totals[fieldType]]}</td>
    `;

    if (currentField == 11) {
      alert(`Can't add more ${fieldType}s`);
      return;
    }

    html += `<td  colspan="2">
	  <input
		type="text"
    class=${fieldType}
	  />
	</td>
  </tr>`;
    // console.log(".row." + rowName);

    $(".row." + rowName)
      .last()
      .after(html);

    register(fieldType);
  });

  let register = function (fieldName) {
    console.log(fieldName);
    //console.log($(".row." + fieldName).last());
    let currentRow = $(".row .Lab").last();
    currentRow.on("input", function () {
      console.log("value", $(this).val());

      let fields = $(`.row.${fieldName} input`);
      let values = 0;
      for (let input of fields) {
        values += isNaN(parseFloat(input.value)) ? 0 : parseFloat(input.value);
      }

      let score = values / totals[fieldName];
      $(`#${fieldName}`).html(score.toFixed(2));

      let labels = $(".card label");
      let finalTotal = 0;
      for (let input of labels) {
        if (input == labels[5]) {
          //alert("Break");
          break;
        }
        finalTotal += isNaN(parseFloat(input.textContent))
          ? 0
          : parseFloat(input.textContent);
      }
      $(`#Total`).html(finalTotal.toFixed(2));
    });
  };
});
