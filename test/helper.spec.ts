describe("helper tests", () => {
  it('rotates 1,1 around 0,0 by 90 degrees',
    () => expect(bo.helpers.mathHelper.rotate(new bo.helpers.point(0, 0), new bo.helpers.point(1, 1), 90)).toEqual(new bo.helpers.point(-0.9999999999999999, 1)) // math problems where rounding can be off slightly
  );
  
  it('rotates 1,1 around 0,0 by 90 degrees (with rounding)',
    () => expect(bo.helpers.mathHelper.rotate(new bo.helpers.point(0, 0), new bo.helpers.point(1, 1), 90).round()).toEqual(new bo.helpers.point(-1, 1))
  );

  it('rotates [20,5] around 0,0 by 180 degrees (with rounding)',
    () => expect(bo.helpers.mathHelper.rotate(new bo.helpers.point(0, 0), new bo.helpers.point(20, 5), 180).round()).toEqual(new bo.helpers.point(-20, -5))
  );

  it('rotates [12,20] around [5,5] by 270 degrees (with rounding)',
    () => expect(bo.helpers.mathHelper.rotate(new bo.helpers.point(5, 5), new bo.helpers.point(12, 20), 270).round()).toEqual(new bo.helpers.point(20, -2))
  );

  var point = new bo.helpers.point(114, 101);
  var polygon = [new bo.helpers.point(113, 100), new bo.helpers.point(113, 102), new bo.helpers.point(214, 102)
    , new bo.helpers.point(214, 100)];
  it('point [114,101] is within polygon [113,100][113,102][214,102][214,100]',
    () => expect(bo.helpers.mathHelper.isPointWithinPolygon(point, polygon)).toEqual(true)
  );

  
  var point2 = new bo.helpers.point(-5, 1);
  var polygon2 = [new bo.helpers.point(0, 0), new bo.helpers.point(0, 15), new bo.helpers.point(15, 15)
    , new bo.helpers.point(15, 0)];
  it('point [-5,1] is not within polygon [0,0][0,15][15,15][15,0]',
    () => expect(bo.helpers.mathHelper.isPointWithinPolygon(point2, polygon2)).toEqual(false)
  );
})
