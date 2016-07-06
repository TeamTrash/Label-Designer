describe("helper tests", () => {
  it("rotates 1,1 around 0,0 by 90 degrees",
    () => expect(bo.helpers.MathHelper.rotate(new bo.helpers.Point(0, 0), new bo.helpers.Point(1, 1), 90)).toEqual(new bo.helpers.Point(-0.9999999999999999, 1)) // math problems where rounding can be off slightly
  );

  it("rotates 1,1 around 0,0 by 90 degrees (with rounding)",
    () => expect(bo.helpers.MathHelper.rotate(new bo.helpers.Point(0, 0), new bo.helpers.Point(1, 1), 90).round()).toEqual(new bo.helpers.Point(-1, 1))
  );

  it("rotates [20,5] around 0,0 by 180 degrees (with rounding)",
    () => expect(bo.helpers.MathHelper.rotate(new bo.helpers.Point(0, 0), new bo.helpers.Point(20, 5), 180).round()).toEqual(new bo.helpers.Point(-20, -5))
  );

  it("rotates [12,20] around [5,5] by 270 degrees (with rounding)",
    () => expect(bo.helpers.MathHelper.rotate(new bo.helpers.Point(5, 5), new bo.helpers.Point(12, 20), 270).round()).toEqual(new bo.helpers.Point(20, -2))
  );

  let point = new bo.helpers.Point(114, 101);
  let polygon = [new bo.helpers.Point(113, 100), new bo.helpers.Point(113, 102), new bo.helpers.Point(214, 102)
    , new bo.helpers.Point(214, 100)];
  it("point [114,101] is within polygon [113,100][113,102][214,102][214,100]",
    () => expect(bo.helpers.MathHelper.isPointWithinPolygon(point, polygon)).toEqual(true)
  );

  let point2 = new bo.helpers.Point(-5, 1);
  let polygon2 = [new bo.helpers.Point(0, 0), new bo.helpers.Point(0, 15), new bo.helpers.Point(15, 15)
    , new bo.helpers.Point(15, 0)];
  it("point [-5,1] is not within polygon [0,0][0,15][15,15][15,0]",
    () => expect(bo.helpers.MathHelper.isPointWithinPolygon(point2, polygon2)).toEqual(false)
  );
})
