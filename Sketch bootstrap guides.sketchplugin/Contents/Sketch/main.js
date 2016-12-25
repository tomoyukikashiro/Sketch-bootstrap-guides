// function generateGuide(context) {
// 
//   // We are passed a context variable when we're run.
//   // We use this to get hold of a javascript object
//   // which we can use in turn to manipulate Sketch.
//   var sketch = context.api();
// 
//   // Next we want to extract the selected page of the selected (front-most) document
//   var document = sketch.selectedDocument;
//   var page = document.selectedPage;
// 
//   // Now let's create a new text layer, using a large font, and a traditional value...
//   var layer = page.newText({alignment: NSTextAlignmentCenter, systemFontSize: 36, text:"Hello World"});
// 
//   // ...resize it so that the text just fits...
//   layer.resizeToFitContents();
// 
//   // Finally, lets center the view on our new layer
//   // so that we can see where it is.
//   document.centerOnLayer(layer);
// };

function extend(org, options) {
  var res = Object.create(null);
  for (key in org) {
    if (org.hasOwnProperty(key)) {
      res[key] = org[key];
    }
  }
  for (key in options) {
    if (options.hasOwnProperty(key)) {
      res[key] = options[key];
    }
  }
  return res;
}

function showMessage(message) {
  var userInput = COSAlertWindow.new();
  userInput.setMessageText(message);
  userInput.runModal();
}

var Twbs = {
  COLUMN_NUM: 12,
  GUTTER_WIDTH: 15,
  getGridKey: function(width) {
    if (width >=  this.grid.xl) {
      return 'xl';
    } else if (width >=  this.grid.lg) {
      return 'lg';
    } else if (width >= this.grid.md) {
      return 'md';
    } else if (width >= this.grid.sm) {
      return 'sm';
    } else {
      return 'xs';
    }
  },
  /**
   * If grid is xs this function does not return anything
   */
  getContainerWidth: function(width) {
    return this.container[this.getGridKey(width)];
  }
};

var Twbs3 = extend(Twbs, {
  grid: {
    sm: 768,
    md: 992,
    lg: 1200
  },
  container: {
    sm: 750,
    md: 970,
    lg: 1170
  },
});

var Twbs4 = extend(Twbs, {
  isVersion4: true,
  grid: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  container: {
    sm: 540,
    md: 720,
    lg: 960, 
    xl: 1140
  },
});


function generateTwbs3Guide(context) {
  generateGuide(context, Twbs3)
}
function generateTwbs3FluidGuide(context) {
  generateGuide(context, Twbs3, true)
}

function generateTwbs4Guide(context) {
  generateGuide(context, Twbs4)
}
function generateTwbs4FluidGuide(context) {
  generateGuide(context, Twbs4, true)
}

function generateGuide(context, twbs, isFluid) {
  this.context = context;
  this.doc = this.context.document;
  this.page = this.doc.currentPage();
  this.artBoard = this.page.currentArtboard();

  if (!this.artBoard) {
    showMessage('This plugin needs Artboard.');
    return;
  }
  if (twbs.isVersion4 && (twbs.getGridKey(this.artBoard.frame().width()) === 'xs') || (twbs.getGridKey(this.artBoard.frame().width()) === 'sm')){
    showMessage('This plugin needs ' + twbs.grid.md + 'px width at least.');
    return;
  } else if (twbs.getGridKey(this.artBoard.frame().width()) === 'xs') {
    showMessage('This plugin needs ' + twbs.grid.sm + 'px width at least.');
    return;
  }

  var twbsContainerWidth = isFluid ? this.artBoard.frame().width() : twbs.getContainerWidth(this.artBoard.frame().width());
  var guideX = (this.artBoard.frame().width() / 2) - (twbsContainerWidth / 2);
  var cellWidth = (twbsContainerWidth / twbs.COLUMN_NUM) - (twbs.GUTTER_WIDTH * 2);

  var artBoardHRuler = this.artBoard.horizontalRulerData();
  artBoardHRuler.addGuideWithValue(guideX);
  for (var i = 0;  twbs.COLUMN_NUM > i; i++) {
    guideX += twbs.GUTTER_WIDTH;
    artBoardHRuler.addGuideWithValue(guideX);
    guideX += cellWidth;
    artBoardHRuler.addGuideWithValue(guideX);
    guideX += twbs.GUTTER_WIDTH;
    if (i == twbs.COLUMN_NUM - 1) {
      artBoardHRuler.addGuideWithValue(guideX);
    }
  }
}
