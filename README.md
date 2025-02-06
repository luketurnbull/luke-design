# Tech used

- (Tanstack Start)[https://start.tanstack.com/]
- (Clerk)[https://clerk.com/docs/components/overview]
- (Convex)[https://www.convex.dev/]
- (Tailwind)[https://tailwindcss.com/]
- (Shadcn/ui)[https://ui.shadcn.com/docs/components/button]

Deployed to: https://luke-design.vercel.app/

# Setup Clerk

Follow https://docs.convex.dev/auth/clerk until you have
CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, and CLERK_JWT_ISSUER_DOMAIN all in the .env file and the appropriate CLerk domain in convex/auth.config.ts.

Then run `npx convex dev`.

# TODO

Priorities:

- Optimise GLTF model in Blender
- Realistic lighting
- Camera movement to different parts of the scene

- [x] Create a new convex / tanstack start project
- [x] Add Clerk auth
- [x] Deploy to Vercel
- [x] Add shadcn/ui
- [x] Get posts working in Convex to get some understanding of how it works
- [x] Create table to store models
- [x] Create sidebar to display users t-shirt models
- [x] Add button to create a new t-shirt model
- [ ] Add react-three-fiber to the project
- [ ] Add t-shirt model to the screen
  - [ ] Add Draco compression to the texture
  - [ ] Use GLTF to r3f to easily modulise the model (https://gltf.pmnd.rs/)
- [ ] Add Tweakpane for testing
- [ ] Refine scene to look realistic and add lighting (Use custom shader for lighting?)
- [ ] HDR Environment map?
- [ ] Directional and spot light, add to Tweakpane to test
- [ ] Tone mapping? Add to Tweakpane to test
- [ ] Display textures in a panel
- [ ] Allow user to add different textures to the model
- [ ] Allow user to change colour of the model
- [ ] Make user settings, let the tinker with the scene and lighting?
- [ ] Smooth transitions, could blender between textures?
