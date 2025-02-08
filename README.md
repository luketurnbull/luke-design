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
- [x] Add react-three-fiber to the project
- [x] Create basic scene with spinning cube
- [x] Add t-shirt model to the screen
  - [x] Add Draco compression to the texture
  - [x] Use GLTF to r3f to easily modulise the model (https://gltf.pmnd.rs/)
- [x] Add Tweakpane or Leva UI for testing
- [x] Refine scene to look realistic and add lighting (Use custom shader for lighting?)
- [x] HDR Environment map?
- [x] Directional and spot light, add to Tweakpane or Leva UI to test
- [x] Display textures in a panel
- [x] Allow user to add different textures to the model
- [x] Add Leva controls to materials to play with settings
- [x] Work on better lighting
- [x] Better changing states with react spring?
- [x] Add delete button functionality to delete a model
- [x] Collapse the sidebar by default
- [ ] Documentation

## Would be nice to have

- [ ] Add go back button when zoomed in on the model
- [ ] Work on camera controls, to allow user to pan around the model without the camera going in the mesh
- [ ] Hover over mesh to highlight?
- [ ] Allow user to add materials to different parts of the model
- [ ] Allow user to change colour of the model
- [ ] Make user settings, let them tinker with the scene and lighting?
