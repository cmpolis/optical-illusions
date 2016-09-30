//
//
//
var container = d3.select('#illusion-container'),
    identity = function(d) { return d; },
    _reveal = function() { this.attr('reveal', this.attr('reveal') === '' ? null : ''); };

//
// Cafe Wall Illusion: Offset tiles (look skewed)
var cafewall = function(svg, width) {
  var height = width * 0.667,
      tileWidth = width / 12,
      tileHeight = height / 12,
      yTicks = d3.range(-0.5, height-1, tileHeight),
      tileOffsets = d3.range(0,12).map(function(d) {
        return Math.sin(Math.PI * (d / 4)) * tileWidth;
      });
  svg.attr('height', height).attr('width', width);

  svg.selectAll('.h-line').data(yTicks).enter()
    .append('line').attr('class', 'h-line')
    .attr('x1', 0).attr('x2', width)
    .attr('y1', identity)
    .attr('y2', identity);

  svg.selectAll('.tile-group').data(yTicks).enter()
    .append('g')
      .attr('class', 'tile-group')
      .attr('transform', function(d, ndx) {
        return 'translate('+(tileOffsets[ndx] - 10)+','+d+')' });

  svg.selectAll('.tile-group')
    .selectAll('rect').data(d3.range(-1,7))
    .enter().append('rect')
      .attr('x', function(d) { return d * tileWidth * 2; })
      .attr('width', tileWidth)
      .attr('height', tileHeight);
  this.reveal = _reveal.bind(svg);
};


//
// Ehrenstein Illusion: Square inside a bunch of rects
var ehrenstein = function(svg, width) {
  var height = width * 0.667,
      dRadii = height / 40,
      radii = d3.range(dRadii, (height * 0.45), dRadii);

  svg.attr('height', height).attr('width', width);
  svg.selectAll('circle').data(radii)
    .enter().append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', identity);
  svg.append('rect')
    .attr('height', height / 2)
    .attr('width', height / 2)
    .attr('transform', 'translate('+(height * 0.25) +','+(width * 0.25) + ')'+
                       'rotate(45 '+(height / 2)+','+(height / 2)+')');
  this.reveal = _reveal.bind(svg);
};

//
// Muller-Lyer Illusion: <--> and >--<
var muller = function(svg, width) {
  var height = width * 0.667,
      lineLength = width * 0.5,
      chevronLength = dC = width * 0.125;

  svg.attr('height', height).attr('width', width);
  svg.append('path').attr('class', 'reveal-guide')
    .attr('d', 'M'+(dC*2)+','+dC+' v'+(height * 0.4) +
               'M'+(dC*2 + (lineLength * 0.25))+','+dC+' v'+(height * 0.4) +
               'M'+(dC*2 + (lineLength * 0.5))+','+dC+' v'+(height * 0.4) +
               'M'+(dC*2 + (lineLength * 0.75))+','+dC+' v'+(height * 0.4) +
               'M'+(dC*2 + lineLength)+','+dC+' v'+(height * 0.4));

  svg.append('path').attr('class', 'primary')
    .attr('transform', 'translate('+dC+',0)')
    .attr('d', 'M0,0 l'+dC+','+dC+' l-'+dC+','+dC+' m'+dC+',-'+dC+' h'+lineLength+' l'+dC+',-'+dC+' m-'+dC+','+dC+' l'+dC+','+dC);
  svg.append('path').attr('class', 'primary')
    .attr('transform', 'translate('+(dC * 2)+','+(height * 0.4)+')')
    .attr('d', 'M'+dC+',0 l-'+dC+','+dC+' l'+dC+','+dC+' m-'+dC+',-'+dC+' h'+lineLength+' l-'+dC+',-'+dC+' m'+dC+','+dC+' l-'+dC+','+dC);

  this.reveal = _reveal.bind(svg);
};

//
// Ebbinghaus Illusion: circles surrounded by large/small circles
var ebbinghaus = function(svg, width) {
  var height = width * 0.667,
      height2 = height * 0.5,
      innerR = width * 0.05,
      rightCX = width * 0.75,
      leftCX = width * 0.25,
      rightTheta = d3.range(0, 360, 45),
      leftTheta = d3.range(0, 360, 60);

  svg.attr('height', height).attr('width', width);
  svg.selectAll('circle.inner').data([rightCX, leftCX]).enter()
    .append('circle').attr('class', 'inner')
    .attr('cx', identity)
    .attr('cy', height2)
    .attr('fill', 'orange')
    .attr('r', innerR);
  svg.selectAll('circle.right').data(rightTheta).enter()
    .append('circle').attr('class', 'right outer')
    .attr('cx', rightCX)
    .attr('cy', height2)
    .attr('fill', 'steelblue')
    .attr('r', width * 0.02)
    .attr('transform', function(theta) {
      return 'rotate('+theta+','+rightCX+','+height2+') ' +
             'translate('+(width * 0.08)+',0)'; });
  svg.selectAll('circle.left').data(leftTheta).enter()
    .append('circle').attr('class', 'left outer')
    .attr('cx', leftCX)
    .attr('cy', height2)
    .attr('r', width * 0.075)
    .attr('transform', function(theta) {
      return 'rotate('+theta+','+leftCX+','+height2+') ' +
             'translate('+(width * 0.16)+',0)'; });

  svg.append('path').attr('class', 'reveal-line')
    .attr('d', 'M'+leftCX+','+(height2-innerR)+' h'+(rightCX - leftCX) +
               ' M'+leftCX+','+(height2+innerR)+' h'+(rightCX - leftCX));
  this.reveal = _reveal.bind(svg);
};

//
// aaaaanrd render!
var containerWidth = parseInt(container.style('width')),
    renderFns = {
      'cafe-wall-illusion': cafewall,
      'ehrenstein-illusion': ehrenstein,
      'muller-illusion': muller,
      'ebbinghaus-illusion': ebbinghaus
    };
d3.selectAll('.illusion').each(function() {
  var svg = d3.select(this),
      renderFn = renderFns[svg.attr('id')],
      _chart = new renderFn(svg, containerWidth);

  d3.select(this.parentNode).selectAll('a[reveal]')
    .each(function() { this.addEventListener('click',  _chart.reveal); });
  this.addEventListener('click',  _chart.reveal);
});
