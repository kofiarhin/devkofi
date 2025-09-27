describe("server entrypoint", () => {
  const originalExit = process.exit;
  const originalError = console.error;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.exit = originalExit;
    console.error = originalError;
    jest.resetModules();
  });

  it("starts the server without exiting when startup succeeds", async () => {
    const startServer = jest.fn(async () => undefined);
    jest.doMock("../server", () => ({ startServer }));
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    jest.isolateModules(() => {
      require("../index.js");
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(startServer).toHaveBeenCalledTimes(1);
    expect(exitSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs and exits when startup fails", async () => {
    const startServer = jest.fn(async () => {
      throw new Error("boom");
    });
    jest.doMock("../server", () => ({ startServer }));
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    jest.isolateModules(() => {
      require("../index.js");
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(startServer).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("Server startup failed:", "boom");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
